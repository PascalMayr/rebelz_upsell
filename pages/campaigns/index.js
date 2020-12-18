import { useState, useCallback, useContext, useRef } from 'react';
import { Page, Card, Layout } from '@shopify/polaris';
import SaleStormBannerFormatter from '../../components/salestorm_banner_formatter';
import { Editor } from '@tinymce/tinymce-react';
import '../../styles/pages_campaigns_index.css';
import publishCampaign from '../../services/publish_campaign';
import unpublishCampaign from '../../services/unpublish_campaign';
import { AppContext } from '../_app';
import SalestormTriggers from '../../components/salestorm_triggers';

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
    message: '<div bis_skin_checked="1" class="mce-content-body" contenteditable="true" style="position: relative;" spellcheck="false"><p style="text-align: center; color: #fff;" data-mce-style="text-align: center; color: #fff;"><span style="color: rgb(236, 240, 241); font-size: 18pt;" data-mce-style="color: #ecf0f1; font-size: 18pt;"><br data-mce-bogus="1"></span></p><p style="text-align: center; color: #fff;" data-mce-style="text-align: center; color: #fff;"><span style="color: rgb(236, 240, 241); font-size: 18pt;" data-mce-style="color: #ecf0f1; font-size: 18pt;">Tap the text to insert your </span></p><p style="text-align: center; color: #fff;" data-mce-style="text-align: center; color: #fff;"><span style="color: rgb(236, 240, 241); font-size: 18pt;" data-mce-style="color: #ecf0f1; font-size: 18pt;">campaign message 🤠</span></p></div>',
    published: false,
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
  const inlineEditorConfig = {
    inline: true,
    height: 200,
    menubar: false,
    plugins: [
      'advlist autolink lists link charmap print preview anchor textcolor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code emoticons link',
    ],
    toolbar:
      'undo redo | fontselect | fontsizeselect | countdownTimerButton | emoticons | bold italic | forecolor backcolor | link | \
      alignleft aligncenter alignright | \
      removeformat',
    font_formats:
      'Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats',
    color_cols: 5,
    branding: false,
    elementpath: false,
    placeholder: 'Tap to insert your campaign message.',
    draggable_modal: true,
    toolbar_mode: 'wrap',
    statusbar: false,
  };
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
                  <div className="salestorm-banner-preview-container">
                    <div
                      id="salestorm-popup"
                      style={campaign.styles}
                      ref={bannerPreviewRef}
                    >
                      <Editor
                        apiKey={TINY_MCE_API_KEY}
                        init={inlineEditorConfig}
                        initialValue={campaign.message}
                        onEditorChange={(value) => setCampaignProperty(value, 'message')}
                      />
                    </div>
                  </div>
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
        <Card.Section>
          <Card>
            <Card.Section title='Set Triggers'>
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
