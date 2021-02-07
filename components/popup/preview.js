import React, { useEffect, useRef } from 'react';

import defineCustomElementPopup from './define_custom_element';
import getAnimationClassPopup from './get_animation_class';
import getRenderedProductPopup from './get_rendered_product';
import processCampaignTextsPopup from './process_campaign_texts';
import TemplateDebut from './templates/debut/template';

const PreviewPopup = ({ campaign, styles }) => {
  // this component serves for the preview to update the shown web component
  // all updates which happen here are also applied to the template trough react
  const webComponentRef = useRef();
  const webComponentRefShadow =
    webComponentRef &&
    webComponentRef.current &&
    webComponentRef.current.shadowRoot;
  useEffect(() => {
    try {
      // eslint-disable-next-line no-eval
      eval(defineCustomElementPopup('salestorm-popup-template'));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, []);

  useEffect(() => {
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
  }, [styles, webComponentRefShadow]);

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
        popupContainerElement.class = getAnimationClassPopup(
          campaign.animation
        );
      }
    } else {
      return null;
    }
  }, [campaign.animation, webComponentRefShadow]);

  return (
    <salestorm-popup ref={webComponentRef}>
      <TemplateDebut campaign={campaign} styles={styles} />
    </salestorm-popup>
  );
};

export default PreviewPopup;
