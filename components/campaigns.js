import {
  Badge,
  Card,
  ResourceList,
  ResourceItem,
  TextStyle,
  Heading,
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
  CircleDisableMinor,
  ShipmentMajor,
  DiscountsMajor,
  GiftCardMajor,
} from '@shopify/polaris-icons';
import Image from 'next/image';
import '../styles/pages/index.css';
import { useCallback, useState } from 'react';

import publishCampaign from '../services/publish_campaign';
import unpublishCampaign from '../services/unpublish_campaign';
import getCampaigns from '../services/get_campaigns';
import duplicateCampaign from '../services/duplicate_campaign';

import DeleteModal from './delete_modal';

const Campaigns = ({
  enabled,
  persistedCampaigns,
  setPersistedCampaigns,
  filterGlobalCampaign,
}) => {
  const [deleteModalCampaign, setDeleteModalCampaign] = useState(null);
  const closeDeleteModal = useCallback(() => setDeleteModalCampaign(null), []);
  const [sortValue, setSortValue] = useState('DATE_MODIFIED_DESC');
  const emptyStateMarkup = (
    <div className="no-campaigns-container">
      <div className="no-campaigns-image-section">
        <Image src="/imagination.svg" alt="me" width="250" height="250" />
        <Heading>
          Welcome to Salestorm Thunder{' '}
          <span role="img" aria-label="storm">
            ⚡️
          </span>
        </Heading>
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
              <a href="/campaigns/new" className="salestorm-new-campaign-link">
                3. Create a campaign
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Card>
        <div className="salestorm-campaigns-overview">
          <ResourceList
            resourceName={{ singular: 'campaign', plural: 'campaigns' }}
            emptyState={emptyStateMarkup}
            items={persistedCampaigns}
            sortValue={sortValue}
            onSortChange={(selected) => {
              setSortValue(selected);
            }}
            showHeader
            renderItem={(campaign) => {
              const { name, published, targets, strategy } = campaign;
              const url = `/campaigns/${campaign.id}`;
              const page = targets.page;
              const sellType = strategy.sellType;
              const mode = strategy.mode;
              return (
                <ResourceItem
                  id={campaign.id}
                  url={url}
                  accessibilityLabel={`View details for ${name}`}
                  shortcutActions={[
                    {
                      content: 'Edit',
                      icon: EditMinor,
                      onAction: () => (window.location.href = url),
                    },
                    {
                      content: 'Duplicate',
                      icon: DuplicateMinor,
                      onAction: async () => {
                        const savedCampaigns = await duplicateCampaign(
                          campaign.id
                        );
                        setPersistedCampaigns(
                          filterGlobalCampaign(savedCampaigns.data)
                        );
                      },
                    },
                    {
                      content: published ? 'Unpusblish' : 'Publish',
                      icon: published ? CircleDisableMinor : ViewMajor,
                      onAction: async () => {
                        if (published) {
                          await unpublishCampaign(campaign.id);
                          const savedCampaigns = await getCampaigns();
                          setPersistedCampaigns(
                            filterGlobalCampaign(savedCampaigns.data)
                          );
                        } else {
                          await publishCampaign(campaign.id);
                          const savedCampaigns = await getCampaigns();
                          setPersistedCampaigns(
                            filterGlobalCampaign(savedCampaigns.data)
                          );
                        }
                      },
                    },
                    {
                      content: 'Delete',
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
                    {sellType === 'upsell' && (
                      <>
                        <Icon source={ReplaceMajor} />
                        Upsell
                      </>
                    )}
                    {sellType === 'cross_sell' && (
                      <>
                        <Icon source={CartUpMajor} />
                        Cross sell
                      </>
                    )}
                  </Badge>
                  <Badge status="warning">
                    {mode === 'free_shipping' && (
                      <>
                        <Icon source={ShipmentMajor} />
                        Free Shipping
                      </>
                    )}
                    {mode === 'discount' && (
                      <>
                        <Icon source={DiscountsMajor} />
                        Discount
                      </>
                    )}
                    {mode === 'gift' && (
                      <>
                        <Icon source={GiftCardMajor} />
                        Gift
                      </>
                    )}
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
    </>
  );
};

export default Campaigns;
