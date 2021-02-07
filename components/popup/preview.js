import React, { useEffect, useRef } from 'react';

import getAnimationClassPopup from './get_animation_class';
import getRenderedProductPopup from './get_rendered_product';
import processCampaignTextsPopup from './process_campaign_texts';
import TemplateLoader from './templates';

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
    if (webComponentRefShadow) {
      Object.keys(campaign.texts).forEach((textKey) => {
        const campaignTextElement = webComponentRefShadow.querySelector(
          `#salestorm-campaign-text-${textKey}`
        );
        if (
          campaignTextElement &&
          campaignTextElement.innerHTML !== campaign.texts[textKey]
        ) {
          campaignTextElement.innerHTML = processCampaignTextsPopup(
            campaign.texts[textKey]
          );
        }
      });
    }
  }, [campaign.texts, webComponentRefShadow]);

  useEffect(() => {
    if (webComponentRefShadow) {
      const popupContainerElement = webComponentRefShadow.querySelector(
        '#salestorm-popup'
      );
      if (popupContainerElement) {
        popupContainerElement.className = getAnimationClassPopup(
          campaign.animation
        );
      }
    } else {
      return null;
    }
  }, [campaign.animation, webComponentRefShadow]);

  const renderedProduct = getRenderedProductPopup(campaign);

  return (
    <salestorm-popup
      ref={webComponentRef}
      product={JSON.stringify(renderedProduct)}
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
