import { useState, useCallback, useContext, useRef } from 'react';
import { Page, Card, Layout, TextField } from '@shopify/polaris';
import CampaignFormatter from '../../components/campaign_formatter.js';
import '../../styles/pages_campaigns_index.css';
import saveCampaign from '../../services/save_campaign';
import publishCampaign from '../../services/publish_campaign';
import unpublishCampaign from '../../services/unpublish_campaign';
import { AppContext } from '../_app';
import SalestormTriggers from '../../components/campaign_triggers';
import { MobilePlusMajor } from '@shopify/polaris-icons';
import CampaignPreviewSwitch from '../../components/campaign_preview_switch';
import CampaignPreview from '../../components/campaign_preview';
import CampaignResourceSelection from '../../components/campaign_resource_selection';

const Index = () => {
  const context = useContext(AppContext);
  const initialStyles = (screen) => {
    const isDesktop = screen === 'desktop';
    return {
      popup: {
        margin: '0px',
        padding: '1em',
        borderRadius: '0px',
        borderWidth: '0px 0px 0px 0px',
        borderStyle: 'solid',
        backgroundColor: 'rgb(249, 249, 239)',
        backgroundImage: 'url()',
        backgroundRepeat: 'repeat',
        backgroundOrigin: 'padding-box',
        borderColor: 'rgb(0, 128, 96)',
        boxShadow: isDesktop
          ? '1px 5px 30px rgb(0, 0, 0)'
          : '0px 0px 0px rgb(0, 0, 0)',
        width: isDesktop ? '550px' : '100%',
        height: isDesktop ? '450px' : '100%',
        position: 'relative',
      },
      overlay: {
        margin: '0px',
        padding: '0px',
        borderRadius: '0px',
        borderWidth: '0px 0px 0px 0px',
        borderStyle: 'solid',
        backgroundColor: 'rgb(0, 0, 0, 0.3)',
        backgroundImage: 'url()',
        backgroundRepeat: 'repeat',
        backgroundOrigin: 'padding-box',
        borderColor: 'rgb(0, 128, 96)',
      },
      actionButton: {
        margin: '1em',
        padding: '0px',
        borderRadius: '0px',
        borderWidth: '0px 0px 0px 0px',
        borderStyle: 'solid',
        backgroundColor: 'rgb(249, 249, 239)',
        backgroundImage: 'url()',
        backgroundRepeat: 'repeat',
        backgroundOrigin: 'padding-box',
        borderColor: 'rgb(0, 128, 96)',
        boxShadow: '1px 5px 30px rgb(0, 0, 0)',
        position: 'relative',
      },
    };
  };
  const [campaign, setCampaign] = useState({
    styles: initialStyles('desktop'),
    mobileStyles: initialStyles('mobile'),
    message:
      '<p style="text-align: center;" data-mce-style="text-align: center;"><br></p><p style="text-align: center;" data-mce-style="text-align: center;"><span style="font-size: 18pt; color: rgb(0, 0, 0); font-family: arial, helvetica, sans-serif;" data-mce-style="font-size: 14pt; color: #000000; font-family: arial, helvetica, sans-serif;">Congratulations 🎉</span></p><p style="text-align: center;" data-mce-style="text-align: center;"><span style="font-size: 14pt; color: rgb(0, 0, 0); font-family: arial, helvetica, sans-serif;" data-mce-style="font-size: 14pt; color: #000000; font-family: arial, helvetica, sans-serif;">You have unlocked a special Deal!</span></p><p style="text-align: center;" data-mce-style="text-align: center;"><span style="color: rgb(0, 0, 0); font-size: 12pt; font-family: arial, helvetica, sans-serif;" data-mce-style="color: #000000; font-size: 12pt; font-family: arial, helvetica, sans-serif;"><em><strong>Click the text to edit this message.</strong></em></span></p>',
    published: false,
    trigger: 'add_to_cart',
    sell_type: 'up-sell',
    name: '',
    targetProducts: [],
    sellingProducts: [],
  });
  const [preview, setPreview] = useState('desktop');
  const isPreviewDesktop = preview === 'desktop';
  const setCampaignProperty = useCallback(
    (value, id) => setCampaign({ ...campaign, [id]: value }),
    [campaign]
  );
  const popupRef = useRef(null);
  const [publishLoading, setPublishLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  return (
    <Page
      title="Create a new campaign"
      breadcrumbs={[{ content: 'Campaigns', url: '/' }]}
      primaryAction={{
        content: campaign.published ? 'Unpublish campaign' : 'Publish campaign',
        loading: publishLoading,
        onAction: async () => {
          if (campaign.published) {
            try {
              setPublishLoading(true);
              await unpublishCampaign();
              context.setToast({
                shown: true,
                content: 'Successfully unpublished campaign',
                isError: false,
              });
              setCampaign({ ...campaign, published: false });
            } catch (e) {
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
              await publishCampaign(popupRef.current.outerHTML);
              context.setToast({
                shown: true,
                content: 'Successfully published campaign',
                isError: false,
              });
              setCampaign({ ...campaign, published: true });
            } catch (e) {
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
            } catch (e) {
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
          <Layout>
            <Layout.Section>
              <Card>
                <Card.Section title="PREVIEW">
                  <CampaignPreview
                    campaign={campaign}
                    isPreviewDesktop={isPreviewDesktop}
                    popupRef={popupRef}
                    setCampaignProperty={setCampaignProperty}
                  />
                  <CampaignPreviewSwitch
                    onSwitch={(value) => setPreview(value)}
                  />
                </Card.Section>
              </Card>
            </Layout.Section>
          </Layout>
        </Card.Section>
        <Card.Section>
          <CampaignFormatter
            campaign={campaign}
            isPreviewDesktop={isPreviewDesktop}
            setCampaignProperty={setCampaignProperty}
          />
        </Card.Section>
        <Card.Section>
          <Card>
            <Card.Section title="2.) Set Target Products">
              <CampaignResourceSelection
                resourcePickerProps={{
                  resourceType: 'Product',
                  selectMultiple: false,
                  initialSelectionIds: campaign.targetProducts,
                  showVariants: false,
                }}
                buttonProps={{
                  primary: true,
                  icon: MobilePlusMajor,
                  label: 'Choose target Products',
                }}
                onResourceMutation={(resources) =>
                  setCampaignProperty(resources, 'targetProducts')
                }
                resources={campaign.targetProducts}
              />
            </Card.Section>
          </Card>
        </Card.Section>
        <Card.Section>
          <Card>
            <Card.Section title={`3.) Set campaign products`}>
              <CampaignResourceSelection
                resourcePickerProps={{
                  resourceType: 'Product',
                  selectMultiple: false,
                  initialSelectionIds: campaign.sellingProducts,
                  showVariants: false,
                }}
                buttonProps={{
                  primary: true,
                  icon: MobilePlusMajor,
                  label: 'Choose selling Products',
                }}
                onResourceMutation={(resources) =>
                  setCampaignProperty(resources, 'sellingProducts')
                }
                resources={campaign.sellingProducts}
              />
            </Card.Section>
          </Card>
        </Card.Section>
        <Card.Section>
          <Card>
            <Card.Section title="4.) Set Popup Triggers">
              <SalestormTriggers
                trigger={campaign.trigger}
                setCampaignProperty={setCampaignProperty}
              />
            </Card.Section>
          </Card>
        </Card.Section>
      </Card>
    </Page>
  );
};

export default Index;
