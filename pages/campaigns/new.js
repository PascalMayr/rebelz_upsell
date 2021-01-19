import { useState, useCallback, useContext } from 'react';
import { Page, Card, Layout, TextField } from '@shopify/polaris';
import { MobilePlusMajor } from '@shopify/polaris-icons';

import '../../styles/pages_campaigns_index.css';
import saveCampaign from '../../services/save_campaign';
import publishCampaign from '../../services/publish_campaign';
import unpublishCampaign from '../../services/unpublish_campaign';
import SalestormTriggers from '../../components/campaign_triggers';
import { AppContext } from '../_app';
import CampaignFormatter from '../../components/campaign_formatter.js';
import CampaignPreviewSwitch from '../../components/campaign_preview_switch';
import CampaignPreview from '../../components/campaign_preview';
import CampaignResourceSelection from '../../components/campaign_resource_selection';

const New = (props) => {
  const context = useContext(AppContext);
  const initialStyles = () => {
    return {
      popup: {
        margin: '0px',
        padding: '0px',
        borderRadius: '2px',
        borderWidth: '0px 0px 0px 0px',
        borderStyle: 'solid',
        backgroundColor: 'rgb(33, 36, 37)',
        backgroundImage: 'url()',
        backgroundRepeat: 'repeat',
        backgroundOrigin: 'padding-box',
        borderColor: 'rgb(0, 128, 96)',
        boxShadow: '0px 0px 0px rgb(0, 0, 0)',
        width: '600px',
        position: 'relative',
        color: 'rgb(255, 255, 255)',
        fontFamily: "'Open Sans', sans-serif",
      },
      overlay: {
        borderRadius: '0px',
        borderWidth: '0px 0px 0px 0px',
        borderStyle: 'solid',
        backgroundColor: 'rgba(237, 237, 237, 0.20)',
        backgroundImage: 'url()',
        backgroundRepeat: 'repeat',
        backgroundOrigin: 'padding-box',
      },
      secondaryButtons: {
        width: '37px',
        height: '37px',
        borderRadius: '2px',
        borderWidth: '0px 0px 0px 0px',
        borderStyle: 'solid',
        borderColor: 'rgb(0, 128, 96)',
        backgroundColor: 'rgb(67, 67, 67)',
        backgroundImage: 'url()',
        backgroundRepeat: 'repeat',
        backgroundOrigin: 'padding-box',
        boxShadow: '0px 0px 0px rgb(0, 0, 0)',
        fill: 'rgb(255, 255, 255)'
      },
      primaryButtons: {
        margin: '0px',
        borderRadius: '2px',
        borderWidth: '0px 0px 0px 0px',
        borderStyle: 'solid',
        backgroundColor: 'rgb(248, 152, 58)',
        backgroundImage: 'url()',
        backgroundRepeat: 'repeat',
        backgroundOrigin: 'padding-box',
        borderColor: 'rgb(0, 128, 96)',
        boxShadow: '0px 0px 0px rgb(255, 255, 255)',
        position: 'relative',
        fontFamily: "'Open Sans', sans-serif",
        color: 'rgb(255, 255, 255)',
      },
    };
  };
  const [campaign, setCampaign] = useState({
    styles: initialStyles(),
    published: false,
    trigger: 'add_to_cart',
    sellType: 'up-sell',
    name: '',
    products: {
      targets: [],
      selling: [],
    },
    customCSS: '',
    customJS: '',
    animation: {
      type: 'animate__fadeInUp',
      delay: 1,
      speed: 'normal'
    },
    ...props.campaign,
  });
  const [preview, setPreview] = useState('desktop');
  const setCampaignProperty = useCallback(
    (value, id) => setCampaign({ ...campaign, [id]: value }),
    [campaign]
  );
  const [publishLoading, setPublishLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const _getResourcePickerInitialSelectedProducts = (products) => products.map(product => {
    if (product) {
      return ({
        id: product.id,
        variants: product.variants.edges.map(edge => edge.node.id)
      });
    }
  }
  )
  return (
    <Page
      title={props.campaign ? 'Update campaign' : 'Create new campaign'}
      breadcrumbs={[{ content: 'Campaigns', url: '/' }]}
      primaryAction={{
        content: campaign.published ? 'Unpublish campaign' : 'Publish campaign',
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
          content: 'Save draft',
          loading: saveLoading,
          onAction: async () => {
            try {
              setSaveLoading(true);
              const savedCampaign = await saveCampaign(campaign);
              context.setToast({
                shown: true,
                content: 'Successfully saved draft campaign',
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
            <Card.Section title="Where would you like to sell more?">
              <p className='salestorm-subtitle'>
                Customers will see this campaign
                {campaign.trigger === 'add_to_cart'
                  ? ' after clicking Add to cart on the specified target products.'
                  : campaign.trigger === 'checkout'
                  ? ' after clicking Checkout with the specified target products in cart.'
                  : campaign.trigger === 'thank_you'
                  ? ' after purchasing the specified target products.'
                  : ''}
              </p>
              <SalestormTriggers
                trigger={campaign.trigger}
                setCampaignProperty={setCampaignProperty}
              />
            </Card.Section>
            <Card.Section>
              <CampaignResourceSelection
                resourcePickerProps={{
                  resourceType: 'Product',
                  selectMultiple: true,
                  initialSelectionIds: _getResourcePickerInitialSelectedProducts(campaign.products.targets),
                  showVariants: false,
                  showDraftBadge: true,
                  showArchivedBadge: true
                }}
                buttonProps={{
                  primary: true,
                  icon: MobilePlusMajor,
                  label: 'Add target Products',
                }}
                onResourceMutation={(resources) =>
                  setCampaignProperty(
                    { ...campaign.products, targets: resources },
                    'products'
                  )
                }
                resources={campaign.products.targets}
              />
            </Card.Section>
          </Card>
        </Card.Section>
        <Card.Section>
          <Card>
            <Card.Section title="How and what would you like to sell more ?">
              <CampaignResourceSelection
                resourcePickerProps={{
                  resourceType: 'Product',
                  selectMultiple: false,
                  initialSelectionIds: _getResourcePickerInitialSelectedProducts(campaign.products.selling),
                  showVariants: false,
                }}
                buttonProps={{
                  primary: true,
                  icon: MobilePlusMajor,
                  label: 'Add selling Products',
                }}
                onResourceMutation={(resources) =>
                  setCampaignProperty(
                    { ...campaign.products, selling: resources },
                    'products'
                  )
                }
                resources={campaign.products.selling}
                applyDiscount
              />
            </Card.Section>
          </Card>
        </Card.Section>
        <Card.Section>
          <Layout>
            <Layout.Section>
              <Card>
                <Card.Section title="Check, customize and try your Upselling Campaign.">
                  <CampaignPreview
                    campaign={campaign}
                    preview={preview}
                  />
                  <CampaignPreviewSwitch
                    onSwitch={(value) => setPreview(value)}
                  />
                </Card.Section>
                <Card.Section>
                  <CampaignFormatter
                    campaign={campaign}
                    setCampaignProperty={setCampaignProperty}
                  />
                </Card.Section>
              </Card>
            </Layout.Section>
          </Layout>
        </Card.Section>
      </Card>
    </Page>
  );
};

export default New;
