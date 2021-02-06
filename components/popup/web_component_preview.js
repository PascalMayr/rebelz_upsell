import React, { useEffect, useRef } from 'react';

import PlaceholderPreview from '../campaigns/new/preview/placeholder';

import setWebComponentDomDefinitionPopup from './set_web_component_dom_definition';
import WebComponentProductTitlePopup from './web_component_product_title';
import WebComponentProductVariationsPopup from './web_component_product_variations';
import WebComponentProductDescriptionPopup from './web_component_product_description';
import {
  processCampaignTexts,
  getAnimationClass,
} from './web_component_template';

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
    } else {
      return null;
    }
  }, [styles]);

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

  useEffect(() => {
    if (
      webComponentRef &&
      webComponentRef.current &&
      webComponentRef.current.shadowRoot
    ) {
      const popupContainerElement = webComponentRef.current.shadowRoot.querySelector(
        '#salestorm-popup'
      );
      if (popupContainerElement) {
        popupContainerElement.class = getAnimationClass(campaign.animation);
      }
    } else {
      return null;
    }
  }, [campaign.animation]);

  const renderedProduct =
    campaign.products.selling.length > 0
      ? campaign.products.selling[0]
      : PlaceholderPreview;

  return (
    <salestorm-popup ref={webComponentRef}>
      <WebComponentProductTitlePopup slot="product-title">
        {renderedProduct.title}
      </WebComponentProductTitlePopup>
      <WebComponentProductVariationsPopup
        slot="product-variations"
        options={renderedProduct.options}
      />
      <WebComponentProductDescriptionPopup slot="product-description">
        {renderedProduct.descriptionHtml}
      </WebComponentProductDescriptionPopup>
    </salestorm-popup>
  );
};

export default WebComponentPreviewPopup;
