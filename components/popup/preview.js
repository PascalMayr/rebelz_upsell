import React, { useEffect, useRef } from 'react';

import defineCustomElementPopup from './define_custom_element';
import TitleProduct from './product/title';
import VariantsProduct from './product/variants';
import DescriptionProduct from './product/description';
import getRenderedProductPopup from './get_rendered_product';
import getAnimationClassPopup from './get_animation_class';
import processCampaignTextsPopup from './process_campaign_texts';

const PreviewPopup = ({ campaign, styles }) => {
  // this component serves for the preview to update the shown web component
  // all updates which happen here are also applied to the template trough react
  const webComponentRef = useRef();
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
          currentRenderedTextElement.innerHTML = processCampaignTextsPopup(
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
        popupContainerElement.class = getAnimationClassPopup(
          campaign.animation
        );
      }
    } else {
      return null;
    }
  }, [campaign.animation]);

  const renderedProduct = getRenderedProductPopup(campaign);

  return (
    <salestorm-popup ref={webComponentRef}>
      <TitleProduct slot="product-title">{renderedProduct.title}</TitleProduct>
      <VariantsProduct
        slot="product-variations"
        options={renderedProduct.options}
      />
      <DescriptionProduct slot="product-description">
        {renderedProduct.descriptionHtml}
      </DescriptionProduct>
    </salestorm-popup>
  );
};

export default PreviewPopup;
