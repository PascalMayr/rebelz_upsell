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
import NextLink from 'next/link';
import { useCallback, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import DeleteModal from './delete_modal';
import Campaign from './campaign';
import useApi from './hooks/use_api';
import { AppContext } from '../pages/_app';

const Campaigns = ({ enabled, campaigns, setCampaigns }) => {
  const api = useApi();
  const router = useRouter();
  const context = useContext(AppContext);
  const [deleteModalCampaign, setDeleteModalCampaign] = useState(null);
  const closeDeleteModal = useCallback(() => setDeleteModalCampaign(null), []);
  const [sortValue, setSortValue] = useState('CREATED_DESC');
  const emptyStateMarkup = (
    <div className="no-campaigns-container">
      <div className="no-campaigns-image-section">
        <Image src="/imagination.svg" alt="me" width="250" height="250" />
        <Heading>
          Welcome to Rebelz Kickstart Upsells{' '}
          <span role="img" aria-label="storm">
            ⚡️
          </span>
        </Heading>
        <br />
        <p>
          Follow the steps below to create your first Upsell or Cross sell
          funnel.
        </p>
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
        <div className="campaigns-overview">
          <ResourceList
            resourceName={{ singular: 'campaign', plural: 'campaigns' }}
            emptyState={emptyStateMarkup}
            items={campaigns.filter((campaign) => campaign.deleted === null)}
            sortValue={sortValue}
            sortOptions={[
              { label: 'Created ↓', value: 'CREATED_DESC' },
              { label: 'Created ↑', value: 'CREATED_ASC' },
              { label: 'Name ↓', value: 'NAME_DESC' },
              { label: 'Name ↑', value: 'NAME_ASC' },
              { label: '# Views ↓', value: 'VIEWS_DESC' },
              { label: '# Views ↑', value: 'VIEWS_ASC' },
            ]}
            onSortChange={(selected) => {
              let sortedCampaigns;
              if (selected === 'NAME_DESC') {
                sortedCampaigns = campaigns.sort((a, b) =>
                  a.name.localeCompare(b.name)
                );
              } else if (selected === 'NAME_ASC') {
                sortedCampaigns = campaigns.sort((a, b) =>
                  b.name.localeCompare(a.name)
                );
              } else if (selected === 'VIEWS_DESC') {
                sortedCampaigns = campaigns.sort((a, b) => {
                  return b.views - a.views;
                });
              } else if (selected === 'VIEWS_ASC') {
                sortedCampaigns = campaigns.sort((a, b) => {
                  return a.views - b.views;
                });
              } else if (selected === 'CREATED_DESC') {
                sortedCampaigns = campaigns.sort((a, b) => {
                  return new Date(b.created) - new Date(a.created);
                });
              } else if (selected === 'CREATED_ASC') {
                sortedCampaigns = campaigns.sort((a, b) => {
                  return new Date(a.created) - new Date(b.created);
                });
              }
              setCampaigns(sortedCampaigns);
              setSortValue(selected);
            }}
            showHeader
            renderItem={(campaign) => {
              const { name, published } = campaign;
              const url = `/campaigns/${campaign.id}`;
              return (
                <ResourceItem
                  id={campaign.id}
                  onClick={() => router.push(url)}
                  accessibilityLabel={`View details for ${name}`}
                  shortcutActions={[
                    {
                      content: 'Edit',
                      icon: EditMinor,
                      onAction: () => router.push(url),
                    },
                    {
                      content: 'Duplicate',
                      icon: DuplicateMinor,
                      onAction: async () => {
                        try {
                          const duplicate = await api.post(
                            `/api/duplicate-campaign/${campaign.id}`
                          );
                          campaigns.push(duplicate.data);
                          setCampaigns(campaigns);
                          context.setToast({
                            shown: true,
                            content: `Successfully duplicated ${campaign.name}`,
                            isError: false,
                          });
                        } catch (err) {
                          context.setToast({
                            shown: true,
                            content: `Failed to duplicate ${campaign.name}`,
                            isError: true,
                          });
                        }
                      },
                    },
                    {
                      content: published ? 'Unpublish' : 'Publish',
                      icon: published ? CircleDisableMinor : ViewMajor,
                      accessibilityLabel: 'Toggle publish',
                      onAction: async () => {
                        if (published) {
                          try {
                            await api.delete(
                              `/api/unpublish-campaign/${campaign.id}`
                            );
                            // eslint-disable-next-line require-atomic-updates
                            campaign.published = false;
                            setCampaigns(campaigns);
                            context.setToast({
                              shown: true,
                              content: `Successfully unpublished ${campaign.name}`,
                              isError: false,
                            });
                          } catch (err) {
                            context.setToast({
                              shown: true,
                              content: `Failed to unpublish ${campaign.name}`,
                              isError: true,
                            });
                          }
                        } else {
                          try {
                            await api.post(
                              `/api/publish-campaign/${campaign.id}`
                            );
                            // eslint-disable-next-line require-atomic-updates
                            campaign.published = true;
                            setCampaigns(campaigns);
                            context.setToast({
                              shown: true,
                              content: `Successfully published ${campaign.name}`,
                              isError: false,
                            });
                          } catch (err) {
                            context.setToast({
                              shown: true,
                              content: `Failed to publish ${campaign.name}`,
                              isError: true,
                            });
                          }
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
              setCampaigns(
                campaigns.map((campaign) =>
                  campaign.id === deletedCampaign.id
                    ? { ...campaign, deleted: new Date() }
                    : campaign
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
