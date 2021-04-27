import { DateTime } from 'luxon';

import db from '../../db';
import { firstDayOfCurrentBillingCycle } from '../../utils/subscription';

const homeData = async (ctx) => {
  let store = await db.query('SELECT * FROM stores WHERE domain = $1', [
    ctx.state.session.shop,
  ]);
  store = store.rows[0];
  const campaignsData = await db.query(
    `SELECT * FROM campaigns WHERE domain = $1 ORDER BY created DESC`,
    [ctx.state.session.shop]
  );
  const globalCampaign =
    campaignsData.rows.find(
      (campaign) => campaign.id === store.global_campaign_id
    ) || {};
  campaignsData.rows = campaignsData.rows.filter(
    (campaign) => campaign.id !== store.global_campaign_id
  );
  const billingCycleStartDate = firstDayOfCurrentBillingCycle(
    store.subscription_start
  );
  const beginningOfMonth = DateTime.now().startOf('month');
  const views = await db.query(
    'SELECT * FROM views WHERE domain = $1 AND view_date >= $2 ORDER BY view_date',
    [
      ctx.state.session.shop,
      db.dateToSQL(
        DateTime.min(billingCycleStartDate, beginningOfMonth).toJSDate()
      ),
    ]
  );
  const analyticsViews = views.rows.filter(
    (view) => DateTime.fromJSDate(view.view_date) >= beginningOfMonth
  );
  const billingCycleViews = views.rows.filter(
    (view) => DateTime.fromJSDate(view.view_date) >= billingCycleStartDate
  );
  const campaigns = campaignsData.rows.map((campaign) => {
    const viewsCount = billingCycleViews
      .filter((view) => view.campaign_id.toString() === campaign.id.toString())
      .map((row) => parseInt(row.counter, 10))
      .reduce((sum, counter) => sum + counter, 0);
    return {
      ...campaign,
      views: viewsCount,
      sales: 0,
      revenue: 0,
    };
  });
  const viewsCount = campaigns.reduce(
    (sum, campaign) => sum + campaign.views,
    0
  );
  const orders = await db.query(
    `SELECT *
    FROM orders
    WHERE domain = $1
    AND date_part('month', order_time) = date_part('month', (SELECT current_timestamp))
    AND status = 'completed'`,
    [ctx.state.session.shop]
  );
  let averageOrderPrice = 0;
  if (orders.rows.length > 0) {
    const totalOrderValue = orders.rows.reduce(
      (sum, order) => sum + parseInt(order.total_price, 10),
      0
    );
    averageOrderPrice = totalOrderValue / orders.rows.length;
  }
  const totalRevenue = orders.rows.reduce((sum, order) => {
    const orderValue = parseFloat(order.value_added);
    const orderCampaign = campaigns.find(
      (campaign) => campaign.id.toString() === order.campaign_id.toString()
    );
    orderCampaign.sales += 1;
    orderCampaign.revenue += orderValue;
    return sum + orderValue;
  }, 0);

  const days = [];
  const salesPerDay = [];
  const viewsPerDay = [];
  let analyticsDay = beginningOfMonth;
  const endOfMonth = DateTime.now().endOf('month');
  const ordersOfThisDay = (order) =>
    DateTime.fromJSDate(order.order_time).startOf('day').toMillis() ===
    analyticsDay.toMillis();
  const viewsOfThisDay = (view) =>
    DateTime.fromJSDate(view.view_date).toMillis() === analyticsDay.toMillis();
  do {
    days.push(analyticsDay.toJSDate());
    salesPerDay.push(orders.rows.filter(ordersOfThisDay).length);
    const todaysViews = analyticsViews.filter(viewsOfThisDay);
    viewsPerDay.push(
      todaysViews.reduce((sum, view) => sum + parseInt(view.counter, 10), 0)
    );

    analyticsDay = analyticsDay.plus({ days: 1 });
  } while (analyticsDay <= endOfMonth);

  ctx.body = {
    campaigns,
    store,
    averageOrderPrice,
    totalRevenue,
    viewsCount,
    views: viewsPerDay,
    sales: salesPerDay,
    days,
    globalCampaign,
  };
};

export default homeData;
