import {
  Page,
  Button,
  Badge,
  Card,
  Layout,
  Tabs,
  Link,
} from '@shopify/polaris';
import '../styles/pages/index.css';
import NextLink from 'next/link';
import { useState, useContext, useMemo, useCallback } from 'react';
import { useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';

import toggleStoreEnabled from '../services/toggle_store_enabled';
import db from '../server/db';
import config from '../config';
import Campaigns from '../components/campaigns';
import Design from '../components/design';
import Analytics from '../components/analytics';
import saveCampaign from '../services/save_campaign';

import DefaultStateNew from './campaigns/new/defaultState';
import { AppContext } from './_app';

export async function getServerSideProps(ctx) {
  const stores = await db.query('SELECT * FROM stores WHERE domain = $1', [
    ctx.req.cookies.shopOrigin,
  ]);
  const campaigns = await db.query(
    'SELECT * FROM campaigns WHERE domain = $1',
    [ctx.req.cookies.shopOrigin]
  );
  const globalCampaigns = await db.query(
    'SELECT * FROM campaigns WHERE domain = $1 AND global = true',
    [ctx.req.cookies.shopOrigin]
  );
  return {
    props: {
      campaigns: campaigns.rows,
      store: stores.rows[0],
      global: globalCampaigns.rows.length > 0 ? globalCampaigns.rows[0] : {},
    },
  };
}

const Index = ({ store, campaigns, global, appName = 'App' }) => {
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

  const GET_STORE_CURRENCY = gql`
    query storeCurrency {
      shop {
        currencyCode
      }
    }
  `;

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

  const filterGlobalCampaign = (filtercampaigns) =>
    filtercampaigns.filter((filtercampaign) => !filtercampaign.global);

  const [persistedCampaigns, setPersistedCampaigns] = useState(
    filterGlobalCampaign(campaigns)
  );

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
                {currencyFormatter ? currencyFormatter.format(0) : 0}
              </div>
            </Card.Section>
          </Card>
        </Layout.Section>
        <Layout.Section oneThird>
          <Card>
            <Card.Section title="Upsell AOV">
              <p className="salestorm-analytics-subheading">
                Upsell AOV 0.00 € more this month
              </p>
              <div className="salestorm-analytics-value">0.00 %</div>
            </Card.Section>
          </Card>
        </Layout.Section>
        <Layout.Section oneThird>
          <Card>
            <Card.Section title="Total Views">
              <p className="salestorm-analytics-subheading">
                Total views this month. Need some more ? {' '}
                <NextLink href="/pricing">Upgrade Now</NextLink>
              </p>
              <div className="salestorm-analytics-value">
                0 / {store.plan_limit}
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
          persistedCampaigns={persistedCampaigns}
          setPersistedCampaigns={setPersistedCampaigns}
          filterGlobalCampaign={filterGlobalCampaign}
        />
      )}
      <div className={designContainerClassName}>
        <Page
          title="Set a global Design for all Funnel campaigns."
          subtitle="Already created campaigns won't be affected."
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
                    renderAdvanced={id === 'design'}
                  />
                </Layout.Section>
              </Layout>
            </Card.Section>
          </Card>
        </Page>
      </div>
      {id === 'analytics' && <Analytics />}
    </Page>
  );
};

export default Index;
