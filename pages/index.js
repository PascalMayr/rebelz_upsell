import { Page, Button, Badge, Card, Layout, Tabs } from '@shopify/polaris';
import '../styles/pages/index.css';
import NextLink from 'next/link';
import { useState, useContext, useMemo, useCallback } from 'react';
import { useQuery } from 'react-apollo';

import toggleStoreEnabled from '../services/toggle_store_enabled';
import db from '../server/db';
import config from '../config';
import Campaigns from '../components/campaigns';
import Design from '../components/design';
import Analytics from '../components/analytics';
import saveCampaign from '../services/save_campaign';
import GET_STORE_CURRENCY from '../server/handlers/queries/get_store_currency';
import restClient from '../server/handlers/restClient';

import DefaultStateNew from './campaigns/new/defaultState';
import { AppContext } from './_app';
import 'isomorphic-fetch';

export async function getServerSideProps(ctx) {
  const stores = await db.query('SELECT * FROM stores WHERE domain = $1', [
    ctx.req.cookies.shopOrigin,
  ]);
  let campaigns = await db.query(
    `SELECT * FROM campaigns WHERE domain = $1 AND date_part('month', campaigns.created) = date_part('month', (SELECT current_date))`,
    [ctx.req.cookies.shopOrigin]
  );
  campaigns = await Promise.all(
    campaigns.rows.map(async (campaign) => {
      const views = await db.query(
        `SELECT counter FROM views WHERE domain = $1 AND campaign_id = $2 AND date_part('month', views.view_date) = date_part('month', (SELECT current_date))`,
        [ctx.req.cookies.shopOrigin, campaign.id]
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
  const formatDate = (date) => new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'long',hour12: false }).format(date)
  campaigns = campaigns.map((campaign) => ({
    ...campaign,
    ...{
      created: campaign.created
        ? formatDate(campaign.created)
        : campaign.created,
      updated: campaign.updated
        ? formatDate(campaign.updated)
        : campaign.updated,
      deleted: campaign.deleted
        ? campaign.deleted.toString()
        : campaign.deleted,
    },
  }));
  const global = campaigns.find((campaign) => campaign.global === true);
  if (global) {
    delete global.views;
    delete global.sales;
    delete global.revenue;
  }
  campaigns = campaigns.filter((campaign) => !campaign.global);
  const views = await db.query(
    "SELECT * FROM views WHERE domain = $1 AND date_part('month', views.view_date) = date_part('month', (SELECT current_date))",
    [ctx.req.cookies.shopOrigin]
  );
  let viewsCount = 0;
  if (views.rows.length > 0) {
    viewsCount = views.rows
      .map((row) => (row.counter ? parseInt(row.counter, 10) : 0))
      .reduce((sum, counter) => sum + counter);
  }
  const orders = await db.query(
    "SELECT * FROM orders WHERE domain = $1 AND date_part('month', order_time) = date_part('month', (SELECT current_timestamp))",
    [ctx.req.cookies.shopOrigin]
  );
  let averageOrderPrice = 0;
  orders.rows.forEach((order) => {
    averageOrderPrice += parseFloat(order.total_price);
  });
  averageOrderPrice /= orders.rows.length;
  const store = stores.rows[0];

  const referenceDate = views.rows[0] ? views.rows[0].view_date : new Date();

  const month = referenceDate.getUTCMonth();

  const year = referenceDate.getUTCFullYear();

  const days = [];

  const viewsPerDay = [];
  const salesPerDay = [];
  let totalRevenue = 0;

  for (let i = 1; i <= new Date(month, year, 0).getDate(); i++) {
    const dayDate = new Date(year, month, i);
    let viewsThisDay = views.rows.filter(
      (view) => view.view_date.getDate() === i
    );
    if (viewsThisDay.length > 0) {
      viewsThisDay = viewsThisDay
        .map((view) => (view.counter ? parseInt(view.counter, 10) : 0))
        .reduce((sum, counter) => sum + counter);
      viewsPerDay.push(viewsThisDay);
    } else {
      viewsPerDay.push(0);
    }
    const ordersThisDay = orders.rows.filter(
      (order) => order.order_time.getDate() === i
    );
    let salesThisDay = 0;
    if (ordersThisDay.length > 0) {
      await Promise.all(
        ordersThisDay.map(async (order) => {
          let draftOrder = await restClient(
            store.domain,
            `draft_orders/${order.draft_order_id}`,
            store.access_token,
            {
              method: 'GET',
            }
          );
          draftOrder = await draftOrder.json();
          if (
            draftOrder &&
            draftOrder.draft_order &&
            draftOrder.draft_order.status === 'completed'
          ) {
            campaigns = campaigns.map((campaign) => {
              if (campaign.id.toString() === order.campaign_id.toString()) {
                return {
                  ...campaign,
                  sales: campaign.sales + 1,
                  revenue:
                    parseFloat(campaign.revenue) +
                    parseFloat(order.value_added),
                };
              } else {
                return campaign;
              }
            });
            salesThisDay += 1;
            totalRevenue += parseFloat(order.value_added);
          }
        })
      );
    }
    salesPerDay.push(salesThisDay);
    days.push(
      new Intl.DateTimeFormat([], {
        day: 'numeric',
        month: 'short',
      }).format(dayDate)
    );
  }
  return {
    props: {
      campaigns,
      store,
      averageOrderPrice,
      totalRevenue,
      viewsCount,
      views: viewsPerDay,
      sales: salesPerDay,
      days,
      global: global ? global : {},
    },
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
  appName = 'App',
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

  const tabs = useMemo(() => [
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
  ]);

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

  const [globalCampaign, setGlobalCampaign] = useState({
    ...DefaultStateNew,
    ...global,
    global: true,
  });

  const setGlobalCampaignProperty = useCallback(
    (value, id, state = {}) =>
      setGlobalCampaign({ ...globalCampaign, [id]: value, ...state }),
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
            {appName} is{' '}
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
                {currencyFormatter ? currencyFormatter.format(totalRevenue) : 0}
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
                {currencyFormatter
                  ? currencyFormatter.format(averageOrderPrice)
                  : 0}
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
