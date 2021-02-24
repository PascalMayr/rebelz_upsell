import { Page, Button, Badge, Card, Layout, Tabs } from '@shopify/polaris';
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
import DefaultStateNew from './campaigns/new/defaultState';
import Analytics from '../components/analytics';

import { AppContext } from './_app';

export async function getServerSideProps(ctx) {
  const stores = await db.query('SELECT * FROM stores WHERE domain = $1', [
    ctx.req.cookies.shopOrigin,
  ]);
  const campaigns = await db.query(
    'SELECT * FROM campaigns WHERE domain = $1',
    [ctx.req.cookies.shopOrigin]
  );
  return { props: { campaigns: campaigns.rows, store: stores.rows[0] } };
}

const Index = ({ store, campaigns, appName = 'App' }) => {
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

  const [globalCampaign, setGlobalCampaign] = useState({ ...DefaultStateNew });

  const setGlobalCampaignProperty = useCallback(
    (value, id, state = {}) =>
      setGlobalCampaign({ ...globalCampaign, [id]: value, ...state }),
    [globalCampaign]
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
        <NextLink href="/campaigns/new">
          <Button primary>
            <span className="salestorm-add-campaign">+</span> New Campaign
          </Button>
        </NextLink>
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
            <Card.Section title="Total views">
              <p className="salestorm-analytics-subheading">
                Total views this month.
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
        <Campaigns enabled={enabled} campaigns={campaigns} />
      )}
      <div className={id === 'design' ? '' : 'd-none'}>
        <Page>
          <Design
            campaign={globalCampaign}
            setCampaignProperty={setGlobalCampaignProperty}
            advanced
            title="Set a global Design for your popups"
          />
        </Page>
      </div>
      {id === 'analytics' && (
        <Analytics />
      )}
    </Page>
  );
};

export default Index;
