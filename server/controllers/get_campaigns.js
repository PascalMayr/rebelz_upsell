import db from '../db';

const getCampaigns = async (ctx) => {
  let campaigns = await db.query('SELECT * FROM campaigns WHERE domain = $1', [
    ctx.session.shop,
  ]);
  campaigns = await Promise.all(
    campaigns.rows.map(async (campaign) => {
      const views = await db.query(
        `SELECT counter FROM views WHERE domain = $1 AND campaign_id = $2 AND date_part('month', views.view_date) = date_part('month', (SELECT current_date))`,
        [ctx.session.shop, campaign.id]
      );
      let viewsCount = 0;
      if (views.rows.length > 0) {
        viewsCount = views.rows
          .map((row) => (row.counter ? parseInt(row.counter, 10) : 0))
          .reduce((sum, counter) => sum + counter);
      }
      return {
        ...campaign,
        views: viewsCount,
        sales: 0,
        revenue: 0,
      };
    })
  );
  ctx.body = campaigns;
  ctx.status = 200;
};

export default getCampaigns;
