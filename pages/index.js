import { Page, Button, Badge, Card, Layout, Tabs } from '@shopify/polaris';
import '../styles/pages/index.css';
import NextLink from 'next/link';
import { useState, useContext, useCallback } from 'react';
import { useQuery } from 'react-apollo';

import toggleStoreEnabled from '../services/toggle_store_enabled';
import db from '../server/db';
import config from '../config';
import Campaigns from '../components/campaigns';
import Design from '../components/design';
import Analytics from '../components/analytics';
import saveCampaign from '../services/save_campaign';
import GET_STORE_CURRENCY from '../server/handlers/queries/get_store_currency';

import DefaultStateNew from './campaigns/new/defaultState';
import { AppContext } from './_app';
import 'isomorphic-fetch';

export async function getServerSideProps(ctx) {
  let store = await db.query('SELECT * FROM stores WHERE domain = $1', [
    ctx.req.cookies.shopOrigin,
  ]);
  store = store.rows[0];
  let campaigns = await db.query(
    `SELECT * FROM campaigns WHERE domain = $1 AND date_part('month', campaigns.created) = date_part('month', (SELECT current_date))`,
    [ctx.req.cookies.shopOrigin]
  );
  const globalCampaign =
    campaigns.rows.find(
      (campaign) => campaign.id === store.global_campaign_id
    ) || {};
  campaigns.rows = campaigns.rows.filter(
    (campaign) => campaign.id !== store.global_campaign_id
  );
  const views = await db.query(
    "SELECT * FROM views WHERE domain = $1 AND date_part('month', views.view_date) = date_part('month', (SELECT current_date))",
    [ctx.req.cookies.shopOrigin]
  );
  campaigns = campaigns.rows.map((campaign) => {
    const viewsCount = views.rows
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
    [ctx.req.cookies.shopOrigin]
  );
  let averageOrderPrice = 0;
  if (orders.rows.length > 0) {
    averageOrderPrice =
      orders.rows.reduce((order) => order.total_price) / orders.rows.length;
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

  const referenceDate = views.rows[0] ? views.rows[0].view_date : new Date();
  const month = referenceDate.getUTCMonth();
  const year = referenceDate.getUTCFullYear();
  const days = [];

  const viewsPerDay = [];
  const salesPerDay = [];

  for (let i = 1; i <= new Date(month, year, 0).getDate(); i++) {
    const dayDate = new Date(year, month, i);
    let viewsThisDay = views.rows.filter(
      (view) => view.view_date.getDate() === i
    );
    viewsThisDay = viewsThisDay
      .map((view) => parseInt(view.counter, 10))
      .reduce((sum, counter) => sum + counter, 0);
    viewsPerDay.push(viewsThisDay);
    const ordersThisDay = orders.rows.filter(
      (order) => order.order_time.getDate() === i
    );
    salesPerDay.push(ordersThisDay.length);
    days.push(
      new Intl.DateTimeFormat([], {
        day: 'numeric',
        month: 'short',
      }).format(dayDate)
    );
  }
  return {
    props: JSON.parse(
      JSON.stringify({
        campaigns,
        store,
        averageOrderPrice,
        totalRevenue,
        viewsCount,
        views: viewsPerDay,
        sales: salesPerDay,
        days,
        global: globalCampaign,
      })
    ),
  };
}

const Index = ({
  store,
  campaigns,
  viewsCount,
  views,
  sales,
  days,
  averageOrderPrice,
  totalRevenue,
  global,
}) => {
  const context = useContext(AppContext);
  const [enabled, setEnabled] = useState(store.enabled);
  const [toggleEnableLoading, setToggleEnableLoading] = useState(false);
  const toggleEnabled = async () => {
    const nowEnabled = !enabled;
    setToggleEnableLoading(true);
    try {
      await toggleStoreEnabled(nowEnabled);
      setEnabled(nowEnabled);
    } catch (_error) {
      context.setToast({
        shown: true,
        content: nowEnabled ? 'Enabling failed' : 'Disabling failed',
        isError: true,
      });
    } finally {
      setToggleEnableLoading(false);
    }
  };
  const enabledStatus = enabled ? 'enabled' : 'disabled';
  const enabledButtonStatus = enabled ? 'Disable' : 'Enable';

  const priceStatus = store.plan_name ? 'success' : 'new';
  const priceProgress = store.plan_name ? 'complete' : 'incomplete';

  const [tab, setTab] = useState(0);

  const tabs = [
    {
      id: 'campaigns',
      content: 'Campaigns',
      accessibilityLabel: 'Campaigns',
      panelID: 'campaigns-panel',
    },
    {
      id: 'design',
      content: 'Design',
      accessibilityLabel: 'Design',
      panelID: 'design-panel',
    },
    {
      id: 'analytics',
      content: 'Analytics',
      accessibilityLabel: 'Analytics',
      panelID: 'analytics-panel',
    },
  ];

  const { id } = tabs[tab];

  const { data } = useQuery(GET_STORE_CURRENCY);
  const currencyCode = data && data.shop && data.shop.currencyCode;

  let currencyFormatter;
  if (currencyCode) {
    currencyFormatter = new Intl.NumberFormat([], {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'symbol',
    });
  }
  const formattedTotalRevenue = currencyFormatter
    ? currencyFormatter.format(totalRevenue)
    : totalRevenue;
  const formattedAverageOrderPrice = currencyFormatter
    ? currencyFormatter.format(averageOrderPrice)
    : averageOrderPrice;

  const [globalCampaign, setGlobalCampaign] = useState({
    ...DefaultStateNew,
    ...global,
    global: true,
  });

  const setGlobalCampaignProperty = useCallback(
    (value, key, state = {}) =>
      setGlobalCampaign({ ...globalCampaign, [key]: value, ...state }),
    [globalCampaign]
  );

  const [saveLoading, setSaveLoading] = useState(false);
  const designContainerClassName = id === 'design' ? '' : 'd-none';
  const [persistedCampaigns, setPersistedCampaigns] = useState(campaigns);

  return (
    <Page
      fullWidth
      titleMetadata={
        <Badge status={priceStatus} progress={priceProgress}>
          <div className="salestorm-pricing-badge">
            <NextLink href="/pricing">
              {`${store.plan_name || config.planNames.free.toUpperCase()} Plan`}
            </NextLink>
          </div>
        </Badge>
      }
      primaryAction={
        <a href="/campaigns/new" className="salestorm-new-campaign-link">
          <Button primary>
            <span className="salestorm-add-campaign">+</span> New Campaign
          </Button>
        </a>
      }
      secondaryActions={[
        {
          content: 'Useful Tips & Readings',
          disabled: false,
          url: '/tips',
          id: 'tips-readings-button',
        },
        {
          content: 'Upgrade',
          disabled: false,
          url: '/pricing',
          id: 'pricing-button',
        },
      ]}
    >
      <div className="salestorm-enabled-satus-container">
        <div id="salestorm-enabled-status-inner-container">
          <Button
            onClick={toggleEnabled}
            primary={!enabled}
            loading={toggleEnableLoading}
          >
            {enabledButtonStatus}
          </Button>
          <span className="salestorm-enabled-status">
            App is{' '}
            <strong style={{ color: enabled ? '#50b83c' : 'red' }}>
              {enabledStatus}
            </strong>
          </span>
        </div>
      </div>
      <Layout>
        <Layout.Section oneThird>
          <Card>
            <Card.Section title="Total Revenue">
              <p className="salestorm-analytics-subheading">
                The total impact our App made on your store this month.
              </p>
              <div className="salestorm-analytics-value">
                {formattedTotalRevenue}
              </div>
            </Card.Section>
          </Card>
        </Layout.Section>
        <Layout.Section oneThird>
          <Card>
            <Card.Section title="Upsell AOV">
              <p className="salestorm-analytics-subheading">
                The Average Order Value trough our App this month.
              </p>
              <div className="salestorm-analytics-value">
                {formattedAverageOrderPrice}
              </div>
            </Card.Section>
          </Card>
        </Layout.Section>
        <Layout.Section oneThird>
          <Card>
            <Card.Section title="Total Views">
              <p className="salestorm-analytics-subheading">
                Total views used this month.{' '}
                {!store.plan_name && (
                  <>
                    Need some more ?{' '}
                    <NextLink href="/pricing">Upgrade Now</NextLink>
                  </>
                )}
              </p>
              <div className="salestorm-analytics-value">
                {viewsCount} / {store.plan_limit}
              </div>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
      <Tabs
        tabs={tabs}
        selected={tab}
        onSelect={(selectedTabIndex) => setTab(selectedTabIndex)}
        fitted
      />
      {id === 'campaigns' && (
        <Campaigns
          enabled={enabled}
          campaigns={persistedCampaigns}
          setCampaigns={(newCampaigns) => {
            setPersistedCampaigns(
              newCampaigns.filter((campaign) => !campaign.global)
            );
          }}
        />
      )}
      <div className={designContainerClassName}>
        <Page
          title="Create a global Design for all your campaigns."
          subtitle="Note: Already created campaigns won't be affected."
          primaryAction={{
            content: 'Save',
            loading: saveLoading,
            onAction: async () => {
              try {
                setSaveLoading(true);
                const savedCampaign = await saveCampaign(globalCampaign);
                context.setToast({
                  shown: true,
                  content: 'Successfully saved global design',
                  isError: false,
                });
                setGlobalCampaign({
                  ...globalCampaign,
                  ...savedCampaign.data,
                });
              } catch (_error) {
                context.setToast({
                  shown: true,
                  content: 'Global design saving failed',
                  isError: true,
                });
              } finally {
                setSaveLoading(false);
              }
            },
          }}
        >
          <Card>
            <Card.Section>
              <Layout>
                <Layout.Section>
                  <Design
                    campaign={globalCampaign}
                    setCampaignProperty={setGlobalCampaignProperty}
                  />
                </Layout.Section>
              </Layout>
            </Card.Section>
          </Card>
        </Page>
      </div>
      {id === 'analytics' && (
        <Analytics
          viewsCount={viewsCount}
          views={views}
          days={days}
          sales={sales}
          campaigns={persistedCampaigns}
          currencyFormatter={currencyFormatter}
        />
      )}
    </Page>
  );
};

export default Index;
