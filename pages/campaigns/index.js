import { useState, useCallback, useContext, useRef } from 'react';
import { Page, Card, Layout, Button, Icon, Subheading, TextField } from '@shopify/polaris';
import { ResourcePicker } from '@shopify/app-bridge-react';
import SaleStormBannerFormatter from '../../components/salestorm_banner_formatter';
import { Editor } from '@tinymce/tinymce-react';
import '../../styles/pages_campaigns_index.css';
import publishCampaign from '../../services/publish_campaign';
import unpublishCampaign from '../../services/unpublish_campaign';
import { AppContext } from '../_app';
import SalestormTriggers from '../../components/salestorm_triggers';
import {
  MobilePlusMajor,
  ExternalMinor
} from '@shopify/polaris-icons';
import CampaignPreviewSwitch from '../../components/campaign_preview_switch';
import CampaignPreview from '../../components/campaign_preview';
import { Fragment } from 'react';

const Index = () => {
  const context = useContext(AppContext);
  const [campaign, setCampaign] = useState({
    styles: {
      margin: '0px',
      padding: '15px',
      borderRadius: '0px',
      borderWidth: '0px',
      borderRightWidth: '0px',
      borderLeftWidth: '0px',
      borderTopWidth: '0px',
      borderBottomWidth: '0px',
      borderStyle: 'solid',
      backgroundColor: 'rgb(249, 249, 239)',
      backgroundImage: 'url()',
      backgroundRepeat: 'round',
      backgroundOrigin: 'padding-box',
      borderColor: 'rgb(0, 128, 96)',
      boxShadow: '1px 5px 30px rgb(0, 0, 0)',
      width: '550px',
      height: '450px',
      position: 'relative'
    },
    message: '<p style="text-align: center;" data-mce-style="text-align: center;"><br></p><p style="text-align: center;" data-mce-style="text-align: center;"><span style="font-size: 14pt; color: rgb(0, 0, 0); font-family: arial, helvetica, sans-serif;" data-mce-style="font-size: 14pt; color: #000000; font-family: arial, helvetica, sans-serif;">Congratulations 🎉</span></p><p style="text-align: center;" data-mce-style="text-align: center;"><span style="font-size: 14pt; color: rgb(0, 0, 0); font-family: arial, helvetica, sans-serif;" data-mce-style="font-size: 14pt; color: #000000; font-family: arial, helvetica, sans-serif;">You have unlocked a special Deal!</span></p><p style="text-align: center;" data-mce-style="text-align: center;"><span style="color: rgb(0, 0, 0); font-size: 12pt; font-family: arial, helvetica, sans-serif;" data-mce-style="color: #000000; font-size: 12pt; font-family: arial, helvetica, sans-serif;"><em><strong>Click the text to edit this message.</strong></em></span></p>',
    published: false,
    trigger: 'add_to_cart',
    sell_type: 'up-sell',
    name: '',
    targetProducts: {
      open: false,
      resources: []
    },
    sellingProducts: {
      open: false,
      resources: []
    }
  });
  const setCampaignProperty = useCallback(
    (value, id) => setCampaign({ ...campaign, [id]: value }),
    [campaign]
  );
  const setStyleProperty = useCallback(
    (value, id) => {
      setCampaignProperty({ ...campaign.styles, [id]: value }, 'styles');
    },
    [campaign]
  );
  const bannerPreviewRef = useRef(null);
  const [publishLoading, setPublishLoading] = useState(false);
  const [preview, setPreview] = useState('desktop');
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
              await publishCampaign(bannerPreviewRef.current.outerHTML);
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
    >
      <Card>
        <Card.Section>
          <TextField placeholder='Campaign name' onChange={value => setCampaignProperty(value, 'name')} value={campaign.name} />
        </Card.Section>
        <Card.Section>
          <Layout>
            <Layout.Section>
              <Card>
                <Card.Section
                  title={
                    <Fragment>
                      <Subheading element='h3'>PREVIEW</Subheading>
                      <div className='campaign-preview-link-container'>
                        <a href={`/preview`} target="_blank" className='campaign-preview-link'>
                          <div className='campaign-preview-container'>
                            <div>
                              <Icon source={ExternalMinor} color='greenLighter' />
                            </div>
                            See the popup in action
                          </div>
                        </a>
                      </div>
                    </Fragment>
                  }
                >
                  <CampaignPreview campaign={campaign} preview={preview} ref={bannerPreviewRef}/>
                  <CampaignPreviewSwitch onSwitch={(value) => setPreview(value)} />
                </Card.Section>
              </Card>
            </Layout.Section>
          </Layout>
        </Card.Section>
        <Card.Section>
          <SaleStormBannerFormatter
            campaign={campaign}
            setStyleProperty={setStyleProperty}
          />
        </Card.Section>
        {
          // Not MVP
          /*
        <Card.Section>
          <Card>
            <Card.Section title='Would you like to cross - or upsell products?'>
              <SalestormSellType
                sell_type={campaign.sell_type}
                setCampaignProperty={setCampaignProperty}
              />
            </Card.Section>
          </Card>
        </Card.Section>
          */
        }
        <Card.Section>
          <Card>
            <Card.Section title='2.) Set Target Products'>
              <div className='salestorm-choose-targets'>
                {
                  NODE_ENV !== 'localdevelopment' &&
                  <ResourcePicker
                    resourceType='Product'
                    open={campaign.targetProducts.open}
                    selectMultiple
                    onCancel={() => setCampaignProperty({...campaign.targetProducts, open: false})}
                  />
                }
                <Button
                  primary
                  icon={MobilePlusMajor}
                  onClick={() => {
                    setCampaignProperty({...campaign.targetProducts, open: true});
                  }}
                >
                  Choose target products
                </Button>
              </div>
            </Card.Section>
          </Card>
        </Card.Section>
        <Card.Section>
          <Card>
            <Card.Section title={`3.) Set campaign products`}>
              <div className='salestorm-choose-selling-products'>
                <div>
                  {
                    NODE_ENV !== 'localdevelopment' &&
                    <ResourcePicker
                      resourceType='Product'
                      open={campaign.sellingProducts.open}
                      selectMultiple
                      onCancel={() => {
                        setCampaignProperty({...campaign.sellingProducts, open: false})
                      }}
                      onSelection={(selectPayload) => {
                        setCampaignProperty({ ...campaign.sellingProducts, open: false, resources: selectPayload.selection });
                        console.log(selectPayload)
                      }}
                      showVariants={false}
                    />
                  }
                  <Button
                    primary
                    icon={MobilePlusMajor}
                    onClick={() => {
                      setCampaignProperty({...campaign.sellingProducts, open: true})
                    }}
                  >
                    Choose products
                  </Button>
                </div>
              </div>
            </Card.Section>
          </Card>
        </Card.Section>
        <Card.Section>
          <Card>
            <Card.Section title='4.) Set Popup Triggers'>
              <SalestormTriggers
                trigger={campaign.trigger}
                setCampaignProperty={setCampaignProperty} />
            </Card.Section>
          </Card>
        </Card.Section>
      </Card>
    </Page>
  );
};

export default Index;
