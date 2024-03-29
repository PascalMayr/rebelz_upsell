import { Page, Button, Badge, Card, Layout, Tabs } from '@shopify/polaris';
import NextLink from 'next/link';
import { useState, useContext, useCallback, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { CircleUpMajor } from '@shopify/polaris-icons';

import config from '../config';
import Campaigns from '../components/campaigns';
import Design from '../components/design';
import Analytics from '../components/analytics';
import GET_STORE_CURRENCY from '../server/handlers/queries/get_store_currency';
import useApi from '../components/hooks/use_api';
import DefaultStateNew from '../components/campaigns/new/defaultState';

import { AppContext } from './_app';

const Index = () => {
  const context = useContext(AppContext);
  const api = useApi();
  const router = useRouter();

  const [store, setStore] = useState(null);
  const [toggleEnableLoading, setToggleEnableLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [globalCampaign, setGlobalCampaign] = useState(DefaultStateNew);
  const [saveLoading, setSaveLoading] = useState(false);
  const [campaigns, setCampaigns] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let homeData = await api.get('/api/pages/home');
      homeData = homeData.data;
      setStore(homeData.store);
      setCampaigns(homeData.campaigns);
      setAnalytics({
        averageOrderPrice: homeData.averageOrderPrice,
        totalRevenue: homeData.totalRevenue,
        viewsCount: homeData.viewsCount,
        views: homeData.views,
        sales: homeData.sales,
        days: homeData.days,
      });
      if (homeData.globalCampaign) setGlobalCampaign(homeData.globalCampaign);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: currencyData } = useQuery(GET_STORE_CURRENCY);
  const currencyCode =
    currencyData && currencyData.shop && currencyData.shop.currencyCode;

  const setGlobalCampaignProperty = useCallback(
    (value, key, state = {}) =>
      setGlobalCampaign({ ...globalCampaign, [key]: value, ...state }),
    [globalCampaign]
  );

  if (!campaigns || !analytics || !store || !globalCampaign) {
    return null;
  }

  const toggleEnabled = async () => {
    const nowEnabled = !store.enabled;
    setToggleEnableLoading(true);
    try {
      await api.patch('/api/store/enable', { enabled: nowEnabled });
      setStore({
        ...store,
        enabled: nowEnabled,
      });
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
  const enabledStatus = store.enabled ? 'enabled' : 'disabled';
  const enabledButtonStatus = store.enabled ? 'Disable' : 'Enable';
  const enabledStatusClass = store.enabled
    ? 'enabled-status-true'
    : 'enabled-status-false';

  let priceStatus = 'success';
  let priceProgress = 'complete';
  if (store.plan_name === config.planNames.free) {
    priceStatus = 'new';
    priceProgress = 'incomplete';
  }

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

  const { id: tabKey } = tabs[tab];

  let currencyFormatter;
  if (currencyCode) {
    currencyFormatter = new Intl.NumberFormat([], {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'symbol',
    });
  }
  const formattedTotalRevenue = currencyFormatter
    ? currencyFormatter.format(analytics.totalRevenue)
    : analytics.totalRevenue;
  const formattedAverageOrderPrice = currencyFormatter
    ? currencyFormatter.format(analytics.averageOrderPrice)
    : analytics.averageOrderPrice;

  const designContainerClassName = tabKey === 'design' ? '' : 'd-none';

  return (
    <div className="home">
      <Page
        fullWidth
        titleMetadata={
          <Badge status={priceStatus} progress={priceProgress}>
            <div className="pricing-badge">
              <div>{`${store.plan_name} Plan`}</div>
            </div>
          </Badge>
        }
        primaryAction={
          <NextLink href="/campaigns/new">
            <Button primary>
              <span className="add-campaign">+</span> New Campaign
            </Button>
          </NextLink>
        }
        secondaryActions={[
          {
            content: 'Useful tips and readings',
            disabled: false,
            onAction: () => router.push('/tips'),
            id: 'tips-readings-button',
          },

          /*
          {
            content: 'Upgrade',
            disabled: false,
            icon: CircleUpMajor,
            onAction: () => router.push('/pricing'),
          },
          */
        ]}
      >
        <div className="enabled-status-container">
          <div id="enabled-status-inner-container">
            <Button
              onClick={toggleEnabled}
              primary={!store.enabled}
              loading={toggleEnableLoading}
            >
              {enabledButtonStatus}
            </Button>
            <span className="enabled-status">
              App is{' '}
              <strong className={enabledStatusClass}>{enabledStatus}</strong>
            </span>
          </div>
        </div>
        <Layout>
          <Layout.Section oneThird>
            <Card>
              <Card.Section title="Added revenue">
                <p className="analytics-subheading">
                  The total impact our App made on your store this month.
                </p>
                <div className="analytics-value">
                  {formattedTotalRevenue}
                </div>
              </Card.Section>
            </Card>
          </Layout.Section>
          <Layout.Section oneThird>
            <Card>
              <Card.Section title="Upsell AOV">
                <p className="analytics-subheading">
                  The Average Order Value through our App this month.
                </p>
                <div className="analytics-value">
                  {formattedAverageOrderPrice}
                </div>
              </Card.Section>
            </Card>
          </Layout.Section>
          <Layout.Section oneThird>
            <Card>
              <Card.Section title="Views used">
                <p className="analytics-subheading">
                  Views used according to your plan.{' '}
                  {
                  /*
                  !store.plan_name &&
                    (analytics.viewsCount / store.plan_limit) * 100 > 80 && (
                      <>
                        Need some more ?{' '}
                        <div>Upgrade Now</div>
                      </>
                    )
                  */
                  }
                </p>
                <div className="analytics-value">
                  {analytics.viewsCount} / {store.plan_limit}
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
        {tabKey === 'campaigns' && (
          <Campaigns
            enabled={store.enabled}
            campaigns={campaigns}
            setCampaigns={(newCampaigns) => {
              setCampaigns(newCampaigns.filter((campaign) => !campaign.global));
            }}
          />
        )}
        <div className={designContainerClassName}>
          <Page
            title="Create a global design for all your campaigns."
            subtitle="Note: This won't affect already created campaigns."
            primaryAction={{
              content: 'Save',
              loading: saveLoading,
              onAction: async () => {
                try {
                  setSaveLoading(true);
                  const savedCampaign = await api.post(
                    '/api/save-campaign?global=true',
                    globalCampaign
                  );
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
        {tabKey === 'analytics' && (
          <Analytics
            views={analytics.views}
            days={analytics.days}
            sales={analytics.sales}
            campaigns={campaigns}
            currencyFormatter={currencyFormatter}
          />
        )}
      </Page>
    </div>
  );
};

export default Index;
