import { useState, useCallback, useContext, useEffect } from 'react';
import {
  Page,
  Card,
  Layout,
  TextField,
  Badge,
  Button,
  Collapsible,
} from '@shopify/polaris';
import {
  MobilePlusMajor,
  ResetMinor,
  ToolsMajor,
} from '@shopify/polaris-icons';
import { useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';

import '../../../styles/pages/campaigns/new.css';
import saveCampaign from '../../../services/save_campaign';
import publishCampaign from '../../../services/publish_campaign';
import unpublishCampaign from '../../../services/unpublish_campaign';
import TriggerSettings from '../../../components/campaigns/new/settings/triggers';
import StrategySettings from '../../../components/campaigns/new/settings/strategy';
import SellingModeSettings from '../../../components/campaigns/new/settings/selling_mode';
import OptionsCampaign from '../../../components/campaigns/new/options';
import { AppContext } from '../../_app';
import Formatter from '../../../components/campaigns/new/formatter';
import MobileDesktopSwitchPreview from '../../../components/popup/preview/mobile_desktop_switch';
import PreviewPopup from '../../../components/popup/preview';
import ResourceSelectionCampaign from '../../../components/campaigns/new/resource_selection';

import DefaultStateNew from './defaultState';

const GET_STORE_CURRENCY = gql`
  query storeCurrency {
    shop {
      currencyCode
    }
  }
`;

const New = (props) => {
  const context = useContext(AppContext);
  const [campaign, setCampaign] = useState({
    ...DefaultStateNew,
    ...props.campaign,
  });
  const [preview, setPreview] = useState('desktop');
  const setCampaignProperty = useCallback(
    (value, id, state = {}) =>
      setCampaign({ ...campaign, [id]: value, ...state }),
    [campaign]
  );
  const [publishLoading, setPublishLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [rerenderButton, setRerenderButton] = useState(false);
  const title = props.campaign ? 'Update campaign' : 'Create a new campaign';
  const badgeStatus = campaign.published ? 'success' : 'attention';
  const contentStatus = campaign.published ? 'Published' : 'Unpublished';
  const previewContainerClass =
    preview && !rerenderButton ? `salestorm-${preview}-preview-container` : '';

  useEffect(() => {
    if (window.Salestorm && window.Salestorm.hidePopup) {
      document.addEventListener(window.Salestorm.hidePopup.type, () => {
        setRerenderButton(true);
      });
    }
  }, []);
  const [formatter, setFormatter] = useState(false);
  const { data } = useQuery(GET_STORE_CURRENCY);
  const currencyCode = data && data.shop && data.shop.currencyCode;
  const saveLabel = campaign.published ? 'Update' : 'Save draft';
  const publishLabel = campaign.published
    ? 'Unpublish campaign'
    : 'Publish campaign';
  return (
    <Page
      title={title}
      titleMetadata={<Badge status={badgeStatus}>{contentStatus}</Badge>}
      breadcrumbs={[{ content: 'Campaigns', url: '/' }]}
      primaryAction={{
        content: publishLabel,
        loading: publishLoading,
        onAction: async () => {
          if (campaign.published) {
            try {
              setPublishLoading(true);
              const savedCampaign = await saveCampaign(campaign);
              await unpublishCampaign();
              context.setToast({
                shown: true,
                content: 'Successfully unpublished campaign',
                isError: false,
              });
              setCampaign({ ...savedCampaign.data, published: false });
            } catch (_error) {
              context.setToast({
                shown: true,
                content: 'Campaign unpublishing failed',
                isError: true,
              });
              setCampaign({ ...campaign, published: true });
            } finally {
              setPublishLoading(false);
            }
          } else {
            try {
              setPublishLoading(true);
              const savedCampaign = await saveCampaign(campaign);
              await publishCampaign();
              context.setToast({
                shown: true,
                content: 'Successfully published campaign',
                isError: false,
              });
              setCampaign({ ...savedCampaign.data, published: true });
            } catch (_error) {
              context.setToast({
                shown: true,
                content: 'Campaign publishing failed',
                isError: true,
              });
              setCampaign({ ...campaign, published: false });
            } finally {
              setPublishLoading(false);
            }
          }
        },
      }}
      secondaryActions={[
        {
          content: saveLabel,
          loading: saveLoading,
          onAction: async () => {
            try {
              setSaveLoading(true);
              const savedCampaign = await saveCampaign(campaign);
              context.setToast({
                shown: true,
                content: campaign.published
                  ? 'Successfully saved campaign'
                  : 'Successfully saved draft campaign',
                isError: false,
              });
              setCampaign({ ...campaign, ...savedCampaign.data });
            } catch (_error) {
              context.setToast({
                shown: true,
                content: 'Draft campaign saving failed',
                isError: true,
              });
            } finally {
              setSaveLoading(false);
            }
          },
        },
      ]}
    >
      <Card>
        <Card.Section>
          <TextField
            placeholder="Campaign name"
            onChange={(value) => setCampaignProperty(value, 'name')}
            value={campaign.name}
          />
        </Card.Section>
        <Card.Section>
          <Card>
            <Card.Section title="1.) Where would you like to sell more?">
              <TriggerSettings
                campaign={campaign}
                setCampaignProperty={setCampaignProperty}
              />
            </Card.Section>
            <Card.Section>
              <ResourceSelectionCampaign
                resourcePickerProps={{
                  resourceType: 'Product',
                  selectMultiple: true,
                  showVariants: false,
                  showDraftBadge: true,
                  showArchivedBadge: true,
                }}
                buttonProps={{
                  primary: true,
                  icon: MobilePlusMajor,
                  label: 'Add target Products',
                }}
                onResourceMutation={(resources) =>
                  setCampaignProperty(
                    { ...campaign.targets, products: resources },
                    'targets'
                  )
                }
                campaign={campaign}
                resources={campaign.targets.products}
              />
            </Card.Section>
            <Card.Section>
              <ResourceSelectionCampaign
                resourcePickerProps={{
                  resourceType: 'Collection',
                  selectMultiple: true,
                  showVariants: true,
                  showDraftBadge: true,
                  showArchivedBadge: true,
                }}
                buttonProps={{
                  primary: true,
                  icon: MobilePlusMajor,
                  label: 'Add target Collections',
                }}
                onResourceMutation={(resources) =>
                  setCampaignProperty(
                    { ...campaign.targets, collections: resources },
                    'targets'
                  )
                }
                resources={campaign.targets.collections}
              />
            </Card.Section>
          </Card>
        </Card.Section>
        <Card.Section>
          <Card>
            <Card.Section title="2.) How would you like to sell more?">
              <StrategySettings
                campaign={campaign}
                setCampaignProperty={setCampaignProperty}
              />
            </Card.Section>
          </Card>
        </Card.Section>
        <Card.Section>
          <Card>
            <Card.Section title="3.) What would you like to offer?">
              <SellingModeSettings
                campaign={campaign}
                setCampaignProperty={setCampaignProperty}
              />
            </Card.Section>
            {campaign.selling.mode === 'manual' && (
              <Card.Section>
                <ResourceSelectionCampaign
                  resourcePickerProps={{
                    resourceType: 'Product',
                    selectMultiple: true,
                    showVariants: true,
                  }}
                  buttonProps={{
                    primary: true,
                    icon: MobilePlusMajor,
                    label: 'Set Products for this offer',
                  }}
                  onResourceMutation={(resources) =>
                    setCampaignProperty(
                      { ...campaign.selling, products: resources },
                      'selling'
                    )
                  }
                  resources={campaign.selling.products}
                  setCampaignProperty={setCampaignProperty}
                  strategy={campaign.strategy}
                />
              </Card.Section>
            )}
            {campaign.selling.mode === 'auto' && (
              <>
                <Card.Section>
                  <div className="salestorm-auto-selling-settings">
                    <TextField
                      type="number"
                      min="0"
                      value={campaign.strategy.maxItemValue}
                      id="maxItemValue"
                      onChange={(value) =>
                        setCampaignProperty(
                          { ...campaign.strategy, maxItemValue: value },
                          'strategy'
                        )
                      }
                      label="Max item value"
                      placeholder={campaign.strategy.maxItemValue}
                      suffix={currencyCode}
                    />
                    <TextField
                      type="number"
                      min="0"
                      value={campaign.strategy.maxNumberOfItems}
                      id="maxNumberOfItems"
                      onChange={(value) =>
                        setCampaignProperty(
                          { ...campaign.strategy, maxNumberOfItems: value },
                          'strategy'
                        )
                      }
                      label="Max number of items"
                      placeholder={campaign.strategy.maxNumberOfItems}
                    />
                  </div>
                </Card.Section>
                <Card.Section>
                  {campaign.selling.mode === 'auto' && (
                    <ResourceSelectionCampaign
                      resourcePickerProps={{
                        resourceType: 'Product',
                        selectMultiple: true,
                        showVariants: true,
                      }}
                      buttonProps={{
                        primary: true,
                        icon: MobilePlusMajor,
                        label: 'Exclude Products',
                      }}
                      onResourceMutation={(resources) =>
                        setCampaignProperty(
                          { ...campaign.selling, excludeProducts: resources },
                          'selling'
                        )
                      }
                      resources={campaign.selling.excludeProducts}
                      setCampaignProperty={setCampaignProperty}
                    />
                  )}
                </Card.Section>
              </>
            )}
          </Card>
        </Card.Section>
        <Card.Section>
          <Layout>
            <Layout.Section>
              <Card>
                <Card.Section title="4.) Check, try and customize your Campaign Popup before publishing it.">
                  {rerenderButton && (
                    <div className="salestorm-rerender-container">
                      <Button
                        onClick={() => {
                          setRerenderButton(false);
                          document
                            .getElementsByTagName('salestorm-popup')[0]
                            .setAttribute('visible', 'true');
                        }}
                        primary
                        icon={ResetMinor}
                      >
                        show again
                      </Button>
                    </div>
                  )}
                  <div className={previewContainerClass}>
                    <PreviewPopup campaign={campaign} preview={preview} />
                  </div>
                  <MobileDesktopSwitchPreview
                    onSwitch={(value) => setPreview(value)}
                  />
                </Card.Section>
                <Card.Section>
                  <div className="salestorm-advanced-formatter-settings-toggle">
                    <Button
                      icon={ToolsMajor}
                      onClick={() => {
                        setFormatter(!formatter);
                        setTimeout(() => {
                          window.scrollTo(0, document.body.scrollHeight);
                        }, 500);
                      }}
                      disclosure={formatter ? 'down' : 'up'}
                      primary={formatter}
                    >
                      {' '}
                      Advanced Settings, Styles and Texts
                    </Button>
                  </div>
                </Card.Section>
                <Collapsible
                  open={formatter}
                  transition={{
                    duration: '500ms',
                    timingFunction: 'ease-in-out',
                  }}
                  expandOnPrint
                >
                  <Card.Section>
                    <OptionsCampaign
                      campaign={campaign}
                      setCampaignProperty={setCampaignProperty}
                    />
                  </Card.Section>
                  <Card.Section>
                    <Formatter
                      campaign={campaign}
                      setCampaignProperty={setCampaignProperty}
                    />
                  </Card.Section>
                </Collapsible>
              </Card>
            </Layout.Section>
          </Layout>
        </Card.Section>
      </Card>
    </Page>
  );
};

export default New;
