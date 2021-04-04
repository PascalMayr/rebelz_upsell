import { Card, ResourceList, ResourceItem, Heading } from '@shopify/polaris';
import {
  CircleTickOutlineMinor,
  DuplicateMinor,
  DeleteMinor,
  ViewMajor,
  EditMinor,
  CircleDisableMinor,
} from '@shopify/polaris-icons';
import Image from 'next/image';
import '../styles/pages/index.css';
import { useCallback, useState } from 'react';

import publishCampaign from '../services/publish_campaign';
import unpublishCampaign from '../services/unpublish_campaign';
import getCampaigns from '../services/get_campaigns';
import duplicateCampaign from '../services/duplicate_campaign';

import DeleteModal from './delete_modal';
import Campaign from './campaign';

const Campaigns = ({
  enabled,
  persistedCampaigns,
  setPersistedCampaigns,
  filterCampaigns,
}) => {
  const [deleteModalCampaign, setDeleteModalCampaign] = useState(null);
  const closeDeleteModal = useCallback(() => setDeleteModalCampaign(null), []);
  const [sortValue, setSortValue] = useState('DATE_MODIFIED_DESC');
  const emptyStateMarkup = (
    <div className="no-campaigns-container">
      <div className="no-campaigns-image-section">
        <Image src="/imagination.svg" alt="me" width="250" height="250" />
        <Heading>
          Welcome to Thunder Exit Upsell Funnel{' '}
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
            showHeader={false}
            renderItem={(campaign) => {
              const { name, published } = campaign;
              const url = `/campaigns/${campaign.id}`;
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
                          filterCampaigns(savedCampaigns.data)
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
                            filterCampaigns(savedCampaigns.data)
                          );
                        } else {
                          await publishCampaign(campaign.id);
                          const savedCampaigns = await getCampaigns();
                          setPersistedCampaigns(
                            filterCampaigns(savedCampaigns.data)
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
                  <Campaign campaign={campaign} />
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
