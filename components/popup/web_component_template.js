import React from 'react';
import { MobileCancelMajor, ArrowRightMinor } from '@shopify/polaris-icons';
import { Icon } from '@shopify/polaris';

import PlaceholderPreview from '../campaigns/new/preview/placeholder';

import WebComponentProductTitlePopup from './web_component_product_title';
import WebComponentProductVariationsPopup from './web_component_product_variations';
import WebComponentProductDescriptionPopup from './web_component_product_description';

const processCampaignTexts = (text) =>
  text.replace('{{Discount}}', '<span class="salestorm-price"></span>');

const getAnimationClass = (animation) =>
  `animate__animated ${animation.type} animate__delay-${animation.delay}s animate__${animation.speed}`;

const WebComponentTemplatePopup = ({ campaign, styles }) => {
  const renderedProduct =
    campaign.products.selling.length > 0
      ? campaign.products.selling[0]
      : PlaceholderPreview;

  return (
    <template id="salestorm-popup-template">
      <div id="salestorm-overlay-container">
        <style
          id="salestorm-popup-styles"
          dangerouslySetInnerHTML={{ __html: styles }}
        />
        <div
          id="salestorm-popup"
          className={getAnimationClass(campaign.animation)}
        >
          <div id="salestorm-popup-header">
            <slot name="product-title">
              <WebComponentProductTitlePopup>
                {renderedProduct.title}
              </WebComponentProductTitlePopup>
            </slot>
            <div id="salestorm-popup-close">
              <Icon source={MobileCancelMajor} />
            </div>
          </div>
          <div id="salestorm-product">
            <div id="salestorm-product-image-container">
              <div id="salestorm-product-image" />
            </div>
            <div id="salestorm-product-action-container">
              <h3
                dangerouslySetInnerHTML={{
                  __html: processCampaignTexts(campaign.texts.title),
                }}
                id="salestorm-campaign-text-title"
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: processCampaignTexts(campaign.texts.subtitle),
                }}
                id="salestorm-campaign-text-subtitle"
              />
              <div>
                <slot name="product-variations">
                  <WebComponentProductVariationsPopup
                    options={renderedProduct.options}
                  />
                </slot>
              </div>
              <button
                type="button"
                id="salestorm-campaign-text-addToCartAction"
                dangerouslySetInnerHTML={{
                  __html: processCampaignTexts(campaign.texts.addToCartAction),
                }}
              />
              {renderedProduct.descriptionHtml !== '' && (
                <p
                  dangerouslySetInnerHTML={{
                    __html: processCampaignTexts(
                      campaign.texts.seeProductDetailsAction
                    ),
                  }}
                  id="salestorm-campaign-text-seeProductDetailsAction"
                />
              )}
            </div>
          </div>
          <slot name="product-description">
            <WebComponentProductDescriptionPopup
              descriptionHtml={renderedProduct.descriptionHtml}
            />
          </slot>
          <div id="salestorm-popup-footer">
            <div
              id="salestorm-campaign-text-dismissAction"
              dangerouslySetInnerHTML={{
                __html: processCampaignTexts(campaign.texts.dismissAction),
              }}
            />
            <div id="salestorm-popup-footer-checkout-action">
              <span
                dangerouslySetInnerHTML={{
                  __html: processCampaignTexts(campaign.texts.checkoutAction),
                }}
                id="salestorm-campaign-text-checkoutAction"
              />
              <Icon source={ArrowRightMinor} />
            </div>
          </div>
        </div>
      </div>
    </template>
  );
};

export { processCampaignTexts, getAnimationClass };
export default WebComponentTemplatePopup;
