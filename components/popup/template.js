import React from 'react';
import { MobileCancelMajor, ArrowRightMinor } from '@shopify/polaris-icons';
import { Icon } from '@shopify/polaris';

import TitleProduct from './product/title';
import VariantsProduct from './product/variants';
import DescriptionProduct from './product/description';
import getRenderedProductPopup from './get_rendered_product';
import getAnimationClassPopup from './get_animation_class';
import processCampaignTextsPopup from './process_campaign_texts';

const TemplatePopup = ({ campaign, styles }) => {
  const renderedProduct = getRenderedProductPopup(campaign);

  return (
    <template id="salestorm-popup-template">
      <div id="salestorm-overlay-container">
        <style
          id="salestorm-popup-styles"
          dangerouslySetInnerHTML={{ __html: styles }}
        />
        <div
          id="salestorm-popup"
          className={getAnimationClassPopup(campaign.animation)}
        >
          <div id="salestorm-popup-header">
            <slot name="product-title">
              <TitleProduct>{renderedProduct.title}</TitleProduct>
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
                  __html: processCampaignTextsPopup(campaign.texts.title),
                }}
                id="salestorm-campaign-text-title"
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: processCampaignTextsPopup(campaign.texts.subtitle),
                }}
                id="salestorm-campaign-text-subtitle"
              />
              <div>
                <slot name="product-variations">
                  <VariantsProduct options={renderedProduct.options} />
                </slot>
              </div>
              <button
                type="button"
                id="salestorm-campaign-text-addToCartAction"
                dangerouslySetInnerHTML={{
                  __html: processCampaignTextsPopup(
                    campaign.texts.addToCartAction
                  ),
                }}
              />
              {renderedProduct.descriptionHtml !== '' && (
                <p
                  dangerouslySetInnerHTML={{
                    __html: processCampaignTextsPopup(
                      campaign.texts.seeProductDetailsAction
                    ),
                  }}
                  id="salestorm-campaign-text-seeProductDetailsAction"
                />
              )}
            </div>
          </div>
          <slot name="product-description">
            <DescriptionProduct
              descriptionHtml={renderedProduct.descriptionHtml}
            />
          </slot>
          <div id="salestorm-popup-footer">
            <div
              id="salestorm-campaign-text-dismissAction"
              dangerouslySetInnerHTML={{
                __html: processCampaignTextsPopup(campaign.texts.dismissAction),
              }}
            />
            <div id="salestorm-popup-footer-checkout-action">
              <span
                dangerouslySetInnerHTML={{
                  __html: processCampaignTextsPopup(
                    campaign.texts.checkoutAction
                  ),
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

export default TemplatePopup;
