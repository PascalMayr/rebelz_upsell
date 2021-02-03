import React, { useEffect, useRef } from 'react';

import setWebComponentDomDefinitionPopup from './set_web_component_dom_definition';
import { processCampaignTexts } from './web_component_template';

const WebComponentPreviewPopup = ({ campaign, styles }) => {
  // this component serves for the preview to update the shown web component
  // all updates which happen here are also applied to the template trough react
  const webComponentRef = useRef();
  useEffect(() => {
    try {
      // eslint-disable-next-line no-eval
      eval(setWebComponentDomDefinitionPopup('salestorm-popup-template'));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, []);

  // updating styles in the preview
  useEffect(() => {
    if (
      webComponentRef &&
      webComponentRef.current &&
      webComponentRef.current.shadowRoot
    ) {
      const webComponentStyleTag = webComponentRef.current.shadowRoot.querySelector(
        '#salestorm-popup-styles'
      );
      if (webComponentStyleTag) {
        webComponentStyleTag.innerHTML = styles;
      }
    }
  }, [styles]);

  // updating texts in the preview
  useEffect(() => {
    if (
      webComponentRef &&
      webComponentRef.current &&
      webComponentRef.current.shadowRoot
    ) {
      Object.keys(campaign.texts).forEach((textKey) => {
        const currentRenderedTextElement = webComponentRef.current.shadowRoot.querySelector(
          `#salestorm-campaign-text-${textKey}`
        );
        if (
          currentRenderedTextElement &&
          currentRenderedTextElement.innerHTML !== campaign.texts[textKey]
        ) {
          currentRenderedTextElement.innerHTML = processCampaignTexts(
            campaign.texts[textKey]
          );
        }
      });
    }
  }, [campaign.texts]);

  return <salestorm-popup ref={webComponentRef} />;
};

export default WebComponentPreviewPopup;
