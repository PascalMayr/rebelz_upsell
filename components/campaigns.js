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
import NextLink from 'next/link';
import { useCallback, useState } from 'react';

import DeleteModal from './delete_modal';

const Campaigns = ({ campaigns, enabled }) => {
  const [persistedCampaigns, setPersistedCampaigns] = useState(
    campaigns.filter((campaign) => !campaign.global)
  );
  const [deleteModalCampaign, setDeleteModalCampaign] = useState(null);
  const closeDeleteModal = useCallback(() => setDeleteModalCampaign(null), []);

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
              <NextLink href="/campaigns/new">3. Create a campaign</NextLink>
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
