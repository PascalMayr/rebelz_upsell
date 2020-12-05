import { Page, Card, Layout } from '@shopify/polaris';
import SaleStormBannerFormatter from '../../components/salestorm_banner_formatter';
import { Editor } from '@tinymce/tinymce-react';
import '../../styles/pages_campaigns_index.css';

const Index = () => {
  return (
    <Page
      title="Create a new campaign"
      breadcrumbs={[{content: 'Campaigns', url: '/'}]}
    >
      <Card>
        <Card.Section>
          <Layout>
            <Layout.Section>
              <Card>
                <Card.Section title="Preview">
                  <div className='salestorm-banner-preview-container'>
                    <div className='salestorm-banner-preview'>
                      This is the banner preview 🔥
                    </div>
                  </div>
                </Card.Section>
              </Card>
            </Layout.Section>
          </Layout>
        </Card.Section>
        <Card.Section>
          <Card>
            <Editor
              apiKey='efp6k3qsyo4fsxytwgehvnjhlq5dqdbcbt95o2dfny7fj721'
              init={{
                height: 200,
                menubar: false,
                plugins: [
                  'advlist autolink lists link charmap print preview anchor textcolor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code emoticons link'
                ],
                toolbar:
                  'undo redo | fontselect | fontsizeselect | countdownTimerButton | emoticons | bold italic | forecolor backcolor | link | \
                  alignleft aligncenter alignright alignjustify | \
                  removeformat',
                font_formats: 'Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats',
                color_cols: 5,
                branding: false,
                elementpath: false,
                placeholder: 'Your campaign message.',
                draggable_modal: true,
                setup: function (editor) {
                  /* Countdown timers
                  editor.ui.registry.addButton('countdownTimerButton', {
                    icon: 'insert-time',
                    text: 'Countdowns',
                    tooltip: 'Insert Countdown Timer',
                    onAction: function (_) {
                      editor.notificationManager.open({
                        text: 'An error occurred.',
                        type: 'error',
                     });
                    }
                  });
                  */
                },
                toolbar_mode: 'wrap',
                statusbar: false
              }}
              onEditorChange={value => console.log(value)}
            />
          </Card>
        </Card.Section>
        <Card.Section>
          <SaleStormBannerFormatter />
        </Card.Section>
      </Card>
      <Card>

      </Card>
    </Page>
  )
}

export default Index