import {
  Page,
  Button,
  Badge,
  Card,
  ResourceList,
  ResourceItem,
  TextStyle,
  Layout
} from '@shopify/polaris';
import { CircleTickOutlineMinor } from '@shopify/polaris-icons';
import Image from 'next/image';
import '../styles/pages_index.css';
import NextLink from 'next/link';
import { useCallback, useState, useContext } from 'react';

import toggleStoreEnabled from '../services/toggle_store_enabled';
import CampaignDeleteModal from '../components/campaign_delete_modal';
import db from '../server/db';

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

const Index = ({
  campaigns,
  store,
  totalRevenue = 0,
  appName = 'App',
  plan = 'free_plan',
}) => {
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

  const priceStatus = plan === 'free_plan' ? 'new' : 'success';
  const priceProgress = plan === 'free_plan' ? 'incomplete' : 'complete';

  const emptyStateMarkup = (
    <div className="no-campaigns-container">
      <div className="no-campaigns-image-section">
        <Image src="/imagination.svg" alt="me" width="250" height="250" />
        <p>Follow the steps below to get started.</p>
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

  return (
    <Page
      fullWidth
      title="All Campaigns"
      subtitle="Create new campaigns and boost your sales."
      titleMetadata={
        <Badge status={priceStatus} progress={priceProgress}>
          <div className='salestorm-pricing-badge'>
            <NextLink href='/pricing' >{plan.replace('_', ' ').toUpperCase()}</NextLink>
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
          content: 'Upgrade',
          disabled: false,
          url: '/pricing',
          id: 'pricing-button',
        },
      ]}
    >
      <div className="salestorm-enabled-satus-container">
        <div id="salestorm-enabled-status-inner-container">
          <Button onClick={toggleEnabled} primary={!enabled} loading={toggleEnableLoading}>
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
            <Card.Section title='Total Revenue'>
              <p className='salestorm-analytics-subheading'>The total impact our app made on your store.</p>
              <div className='salestorm-analytics-value'>
                <p>

                </p>
              </div>
            </Card.Section>
          </Card>
        </Layout.Section>
        <Layout.Section oneThird>

        </Layout.Section>
        <Layout.Section oneThird>

        </Layout.Section>
      </Layout>
      <Card>
        <div className='salestorm-campaigns-overview'>
          <ResourceList
            resourceName={{ singular: 'campaign', plural: 'campaigns' }}
            emptyState={emptyStateMarkup}
            items={persistedCampaigns}
            renderItem={(campaign) => {
              const { id, name, published } = campaign;
              const url = `/campaigns/${id}`;

              return (
                <ResourceItem
                  id={id}
                  url={url}
                  accessibilityLabel={`View details for ${name}`}
                  shortcutActions={[
                    {
                      content: 'Delete campaign',
                      destructive: true,
                      onAction: () => setDeleteModalCampaign(campaign),
                      size: 'slim'
                    }
                  ]}
                >
                  <h3 className='campaign-title'>
                    <TextStyle variation='strong'>{name}</TextStyle>
                  </h3>
                  <Badge status={published ? 'success' : 'attention'}>
                    {published ? 'Published' : 'Unpublished'}
                  </Badge>
                </ResourceItem>
              );
            }}
          />
        </div>
        { deleteModalCampaign &&
          <CampaignDeleteModal
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
        }
      </Card>
    </Page>
  );
};

export default Index;
