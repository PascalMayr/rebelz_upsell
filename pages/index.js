import {
  Page,
  Button,
  Badge,
  Card,
  ResourceList,
  ResourceItem,
  TextStyle,
  Layout,
  Heading,
  Tabs,
  Icon,
} from '@shopify/polaris';
import {
  CircleTickOutlineMinor,
  DuplicateMinor,
  DeleteMinor,
  CartMajor,
  HeartMajor,
  ProductsMajor,
  ViewMajor,
  ReplaceMajor,
  CartUpMajor,
  EditMinor,
  CircleDisableMinor
} from '@shopify/polaris-icons';
import Image from 'next/image';
import '../styles/pages/index.css';
import NextLink from 'next/link';
import { useCallback, useState, useContext, useMemo } from 'react';
import { useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';

import toggleStoreEnabled from '../services/toggle_store_enabled';
import DeleteModal from '../components/delete_modal';
import db from '../server/db';
import config from '../config';

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

const Index = ({ campaigns, store, appName = 'App' }) => {
  const context = useContext(AppContext);

  const [persistedCampaigns, setPersistedCampaigns] = useState(campaigns);
  const [deleteModalCampaign, setDeleteModalCampaign] = useState(null);
  const closeDeleteModal = useCallback(() => setDeleteModalCampaign(null), []);

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

  const emptyStateMarkup = (
    <div className="no-campaigns-container">
      <div className="no-campaigns-image-section">
        <Image src="/imagination.svg" alt="me" width="250" height="250" />
        <Heading>Welcome to Salestorm Thunder ⚡️</Heading>
        <br />
        <p>Follow the steps below to create your first funnel campaign</p>
        <br />
      </div>
      <div className="no-campaigns-stepper-section">
        <div className="stepper-container">
          <div className="stepper stepper-checked">
            <CircleTickOutlineMinor
              alt="stepper-checkmark"
              className="stepper-checkmark stepper-checked"
            />
            <p>1. Install the app</p>
          </div>
          <div className={`stepper ${enabled ? 'stepper-checked' : ''}`}>
            <CircleTickOutlineMinor
              alt="stepper-checkmark"
              className={`stepper-checkmark ${
                enabled ? 'stepper-checked' : ''
              }`}
            />
            <p>2. Enable the app</p>
          </div>
          <div className="stepper">
            <CircleTickOutlineMinor
              alt="stepper-checkmark"
              className="stepper-checkmark"
            />
            <p id="stepper-new-cammpaign-link">
              <NextLink href="/campaigns/new">3. Create a campaign</NextLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

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
        <Card>
          <div className="salestorm-campaigns-overview">
            <ResourceList
              resourceName={{ singular: 'campaign', plural: 'campaigns' }}
              emptyState={emptyStateMarkup}
              items={persistedCampaigns}
              renderItem={(campaign) => {
                const { name, published, targets, strategy } = campaign;
                const url = `/campaigns/${campaign.id}`;
                const page = targets.page;
                const sellType = strategy.sellType;
                return (
                  <ResourceItem
                    id={campaign.id}
                    url={url}
                    accessibilityLabel={`View details for ${name}`}
                    shortcutActions={[
                      {
                        content: 'Edit campaign',
                        icon: EditMinor,
                        onAction: () => (window.location.href = url),
                      },
                      {
                        content: 'Duplicate campaign',
                        icon: DuplicateMinor,
                        onAction: () => {},
                      },
                      {
                        content: 'Unpusblish campaign',
                        icon: CircleDisableMinor,
                        onAction: () => {},
                      },
                      {
                        content: 'Delete campaign',
                        destructive: true,
                        onAction: () => setDeleteModalCampaign(campaign),
                        icon: DeleteMinor,
                      },
                    ]}
                    persistActions
                  >
                    <h3 className="salestorm-campaign-title">
                      <TextStyle>{name}</TextStyle>
                    </h3>
                    <Badge status={published ? 'success' : 'attention'}>
                      <Icon source={ViewMajor} />
                      {published ? ' Published' : ' Unpublished'}
                    </Badge>
                    <Badge status="info">
                      {page === 'add_to_cart' && (
                        <>
                          <Icon source={ProductsMajor} />
                          {' Product Page'}
                        </>
                      )}
                      {page === 'checkout' && (
                        <>
                          <Icon source={CartMajor} />
                          {' Cart Page'}
                        </>
                      )}
                      {page === 'thank_you' && (
                        <>
                          <Icon source={HeartMajor} />
                          {' Thank you Page'}
                        </>
                      )}
                    </Badge>
                    <Badge>
                      {
                        sellType === 'upsell' &&
                        <>
                          <Icon source={ReplaceMajor} />
                          Upsell
                        </>
                      }
                      {
                        sellType === 'cross_sell' &&
                        <>
                          <Icon source={CartUpMajor} />
                          Cross sell
                        </>
                      }
                    </Badge>
                  </ResourceItem>
                );
              }}
            />
          </div>
          {deleteModalCampaign && (
            <DeleteModal
              campaign={deleteModalCampaign}
              onClose={closeDeleteModal}
              removeFromList={(deletedCampaign) =>
                setPersistedCampaigns(
                  persistedCampaigns.filter(
                    (persistedCampaign) =>
                      persistedCampaign.id !== deletedCampaign.id
                  )
                )
              }
            />
          )}
        </Card>
      )}
    </Page>
  );
};

export default Index;
