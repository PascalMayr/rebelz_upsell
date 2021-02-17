import React, { useEffect, useRef } from 'react';

import getAnimationClassUtil from '../utils/get_animation_class';
import getRenderedProductUtil from '../utils/get_rendered_product';
import TemplateLoader from '../templates';

const PreviewPopup = ({ campaign, preview }) => {
  // this component serves for the preview to update the shown web component
  // all updates which happen here are also applied to the template trough react
  const webComponentRef = useRef();
  const webComponentRefShadow =
    webComponentRef &&
    webComponentRef.current &&
    webComponentRef.current.shadowRoot;

  const onStyleChange = (styles) => {
    if (webComponentRefShadow) {
      const popupStyles = webComponentRefShadow.querySelector(
        '#salestorm-popup-styles'
      );
      if (popupStyles) {
        popupStyles.innerHTML = styles;
      }
    } else {
      return null;
    }
  };

  useEffect(() => {
    try {
      // eslint-disable-next-line no-eval
      eval(campaign.customJS);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [campaign.customJS]);

  return (
    <salestorm-popup
      ref={webComponentRef}
      product={JSON.stringify(getRenderedProductUtil(campaign))}
      texts={JSON.stringify(campaign.texts)}
      multicurrency={campaign.multiCurrencySupport}
      animation={getAnimationClassUtil(campaign.animation)}
      quantityeditable={campaign.quantityEditable}
    >
      <TemplateLoader
        campaign={campaign}
        preview={preview}
        onStyleChange={onStyleChange}
      />
    </salestorm-popup>
  );
};

export default PreviewPopup;
