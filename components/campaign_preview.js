import { Editor } from '@tinymce/tinymce-react';
import { Fragment } from 'react';
import '../styles/components_campaign_preview.css';

const CampaignPreview = ({campaign, preview, popupRef}) => {
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
  const Preview = () =>
  (
    <div
      id="salestorm-popup"
      style={preview === 'desktop' ? campaign.styles : {...campaign.styles, ...campaign.mobileStyles}}
      ref={popupRef}
    >
      <Editor
        apiKey={TINY_MCE_API_KEY}
        init={inlineEditorConfig}
        initialValue={campaign.message}
        onEditorChange={(value) => setCampaignProperty(value, 'message')}
      />
      <br />
      <div id='salestorm-popup-product'>

      </div>
    </div>
  )
  return (
    <Fragment>
      {
        preview === 'desktop' ?
        <div className="salestorm-banner-preview-container">
          <Preview />
        </div>
        :
        <div className="salestorm-banner-preview-container">
          <div className='salestorm-mobile-preview-container'>
            <Preview />
          </div>
        </div>
      }
    </Fragment>
  )
}

export default CampaignPreview