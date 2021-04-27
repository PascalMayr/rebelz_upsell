import { useState, useCallback, useContext } from 'react';
import { Page, Card, Layout, TextField, Badge, Select } from '@shopify/polaris';
import { MobilePlusMajor } from '@shopify/polaris-icons';
import { useQuery } from 'react-apollo';
import { Modal } from '@shopify/app-bridge-react';

import '../../../styles/pages/campaigns/new.css';
import TriggerSettings from '../../../components/campaigns/new/settings/triggers';
import StrategySettings from '../../../components/campaigns/new/settings/strategy';
import SellingModeSettings from '../../../components/campaigns/new/settings/selling_mode';
import { AppContext } from '../../_app';
import ResourceSelectionCampaign from '../../../components/campaigns/new/resource_selection';
import Design from '../../../components/design';
import db from '../../../server/db';
import EntrySettings from '../../../components/campaigns/new/settings/entry';
import GET_STORE_CURRENCY from '../../../server/handlers/queries/get_store_currency';
import useApi from '../../../components/hooks/use_api';

import DefaultStateNew from './defaultState';

export async function getServerSideProps(ctx) {
  let store = await db.query(
    'SELECT global_campaign_id FROM stores WHERE domain = $1',
    [ctx.req.cookies.shopOrigin]
  );
  store = store.rows[0];
  let globalCampaign = await db.query(
    'SELECT * FROM campaigns WHERE domain = $1 AND id = $2',
    [ctx.req.cookies.shopOrigin, store.global_campaign_id]
  );
  globalCampaign = globalCampaign.rows.length > 0 ? globalCampaign.rows[0] : {};
  if (globalCampaign.id) {
    const { styles, texts, customJS, customCSS, options } = globalCampaign;
    globalCampaign = { styles, texts, customJS, customCSS, options };
  }
  return {
    props: {
      global: globalCampaign,
    },
  };
}

const New = (props) => {
  const context = useContext(AppContext);
  const api = useApi();
  const [campaign, setCampaign] = useState({
    ...DefaultStateNew,
    ...props.global,
    ...props.campaign,
  });
  const setCampaignProperty = useCallback(
    (value, id, state = {}) =>
      setCampaign({ ...campaign, [id]: value, ...state }),
    [campaign]
  );
  const [error, setError] = useState('');
  const checkForInputError = (campaignToCheck) => {
    let message = '';
    if (campaignToCheck.name === '') {
      message += 'Please set a Campaign Name. ';
    }
    if (
      campaignToCheck.selling.products.length === 0 &&
      campaignToCheck.selling.mode !== 'auto'
    ) {
      message +=
        'Step 4.) Please set Products to offer or choose the AI mode. ';
    }
    if (message !== '') {
      setError(message);
      return true;
    }
  };
  const [publishLoading, setPublishLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const updateCampaignTitle = 'Update campaign';
  const newCampaignTitle = 'Create a new campaign';
  const [title, setTitle] = useState(
    props.campaign ? updateCampaignTitle : newCampaignTitle
  );
  const badgeStatus = campaign.published ? 'success' : 'attention';
  const contentStatus = campaign.published ? 'Published' : 'Unpublished';
  const { data } = useQuery(GET_STORE_CURRENCY);
  const currencyCode = data && data.shop && data.shop.currencyCode;
  const saveLabel = campaign.published ? 'Update' : 'Save draft';
  const publishLabel = campaign.published
    ? 'Unpublish campaign'
    : 'Publish campaign';
  const targetButton =
    campaign.targets.page === 'add_to_cart'
      ? 'Add to cart'
      : campaign.targets.page === 'checkout'
      ? 'Checkout'
      : 'Continue to Shopping';
  const updated = new Date(campaign.updated);
  const formatDate = (date) => new Intl.DateTimeFormat([], { dateStyle: 'medium', timeStyle: 'long', hour12: false }).format(date)
  return (
    <Page
      title={title}
      titleMetadata={
        <>
          <Badge status={badgeStatus}>{contentStatus}</Badge>
          &nbsp;
          {campaign.updated && (
            <Badge status="info">Last updated: {formatDate(updated)}</Badge>
          )}
        </>
      }
      breadcrumbs={[{ content: 'Campaigns', url: '/home' }]}
      primaryAction={{
        content: publishLabel,
        loading: publishLoading,
        onAction: async () => {
          if (campaign.published) {
            try {
              if (checkForInputError(campaign)) {
                return;
              }
              setPublishLoading(true);
              const savedCampaign = await api.post(
                '/api/save-campaign',
                campaign
              );
              await api.delete(
                `/api/unpublish-campaign/${savedCampaign.data.id}`
              );
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
              if (checkForInputError(campaign)) {
                return;
              }
              setPublishLoading(true);
              const savedCampaign = await api.post(
                '/api/save-campaign',
                campaign
              );
              await api.post(`/api/publish-campaign/${savedCampaign.data.id}`);
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
              if (checkForInputError(campaign)) {
                return;
              }
              setSaveLoading(true);
              const savedCampaign = await api.post(
                '/api/save-campaign',
                campaign
              );
              context.setToast({
                shown: true,
                content: campaign.published
                  ? 'Successfully saved campaign'
                  : 'Successfully saved draft campaign',
                isError: false,
              });
              setCampaign({ ...campaign, ...savedCampaign.data });
              setTitle(updateCampaignTitle);
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
                targets={campaign.targets}
                strategy={campaign.strategy}
                resources={campaign.targets.products}
              />
            </Card.Section>
            <Card.Section>
              <ResourceSelectionCampaign
                resourcePickerProps={{
                  resourceType: 'Collection',
                  selectMultiple: true,
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
            <Card.Section title="2.) When would you like to interact with your customers?">
              <EntrySettings
                campaign={campaign}
                setCampaignProperty={setCampaignProperty}
              />
            </Card.Section>
            {campaign.targets.entry === 'onclick' && (
              <Card.Section>
                <Select
                  options={[
                    {
                      value: true,
                      label:
                        'Interrupt events when clicking - e.g. disabling showing a cart drawer after your customers click Add to cart.',
                    },
                    {
                      value: false,
                      label: 'Do not interrupt events when clicking',
                    },
                  ]}
                  onChange={(value) =>
                    setCampaignProperty(
                      {
                        ...campaign.options,
                        interruptEvents: value === 'true',
                      },
                      'options'
                    )
                  }
                  value={campaign.options.interruptEvents}
                />
              </Card.Section>
            )}
          </Card>
        </Card.Section>
        <Card.Section>
          <Card>
            <Card.Section title="3.) What type of offer would you like to make?">
              <StrategySettings
                campaign={campaign}
                setCampaignProperty={setCampaignProperty}
              />
            </Card.Section>
          </Card>
        </Card.Section>
        <Card.Section>
          <Card>
            <Card.Section title="4.) What would you like to offer?">
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
                    showVariants: false,
                    showDraftBadge: true,
                    showArchivedBadge: true,
                  }}
                  buttonProps={{
                    primary: true,
                    icon: MobilePlusMajor,
                    label: 'Set Products for this campaign',
                  }}
                  onResourceMutation={(resources) =>
                    setCampaignProperty(
                      { ...campaign.selling, products: resources },
                      'selling'
                    )
                  }
                  resources={campaign.selling.products}
                  strategy={campaign.strategy}
                  targets={campaign.targets}
                  showStrategyDetails
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
                      min="1"
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
                        showVariants: false,
                      }}
                      buttonProps={{
                        primary: true,
                        icon: MobilePlusMajor,
                        label: 'Exclude Products from this campaign',
                      }}
                      onResourceMutation={(resources) =>
                        setCampaignProperty(
                          { ...campaign.selling, excludeProducts: resources },
                          'selling'
                        )
                      }
                      resources={campaign.selling.excludeProducts}
                      strategy={campaign.strategy}
                      targets={campaign.targets}
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
              <Design
                title="5. Check try and customize your campaign before publishing it."
                setCampaignProperty={setCampaignProperty}
                campaign={campaign}
                subtitle={
                  <>
                    <div className="salestorm-summary-explanation">
                      <strong>Settings Summary:</strong>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: `Your customers will see this campaign
                    ${
                      campaign.targets.entry === 'onexit'
                        ? 'when leaving '
                        : `when clicking the <strong>${targetButton} Button</strong> on`
                    }
                    the <strong>${
                      campaign.targets.page === 'add_to_cart'
                        ? 'Product page'
                        : campaign.targets.page === 'checkout'
                        ? 'Cart page'
                        : 'Thank you page'
                    }</strong>.
                    <br />
                    ${
                      campaign.targets.entry === 'onexit'
                        ? '<strong>Attention: We will also show this campaign with no items in your customers cart.</strong>'
                        : ''
                    }
                    `,
                        }}
                      />
                      <p
                        dangerouslySetInnerHTML={{
                          __html: `Offered will be <strong>${
                            campaign.strategy.mode === 'discount'
                              ? `a ${campaign.strategy.discount.value} ${campaign.strategy.discount.type} discount</strong> on the claimed product unless specified else for the claimed product.`
                              : campaign.strategy.mode === 'free_shipping'
                              ? 'Free shipping</strong> on the entire order.'
                              : 'an additional gift</strong> to your order.'
                          }`,
                        }}
                      />
                      <p
                        dangerouslySetInnerHTML={{
                          __html:
                            campaign.selling.mode === 'auto'
                              ? `${
                                  campaign.strategy.maxNumberOfItems !== '0'
                                    ? `Maximum <strong>${campaign.strategy.maxNumberOfItems} Products`
                                    : '<strong style="color: red;">0 Products </strong>'
                                }</strong> are chosen by the Product Reccomendations from Shopify ${
                                  campaign.strategy.maxItemValue !== '0'
                                    ? ` with a maximum price of <strong>${campaign.strategy.maxItemValue} ${campaign.strategy.storeCurrencyCode}</strong>`
                                    : ''
                                }. The product below is only for demonstration.`
                              : `<strong style="${
                                  campaign.selling.products.length === 0
                                    ? 'color: red'
                                    : ''
                                }">${campaign.selling.products.length}
                                  Product${
                                    campaign.selling.products.length === 1
                                      ? ''
                                      : 's'
                                  }</strong> will be offered. ${
                                  campaign.selling.products.length === 0
                                    ? 'The product below is only for demonstration.'
                                    : ''
                                }`,
                        }}
                      />
                    </div>
                  </>
                }
              />
            </Layout.Section>
          </Layout>
        </Card.Section>
      </Card>
      <Modal
        open={error !== ''}
        onClose={() => setError('')}
        title="Input Errors."
        message={error}
        primaryAction={{
          content: 'Close',
          onAction: () => setError(''),
        }}
      >
        <div>test</div>
      </Modal>
    </Page>
  );
};

export default New;
