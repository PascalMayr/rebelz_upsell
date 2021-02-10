import React, { useEffect } from 'react';
import { MobileCancelMajor, ArrowRightMinor, PlusMinor, MinusMinor } from '@shopify/polaris-icons';
import { Icon } from '@shopify/polaris';

import TitleProduct from '../../product/title';
import VariantsProduct from '../../product/variants';
import DescriptionProduct from '../../product/description';
import getRenderedProductPopup from '../../get_rendered_product';
import getAnimationClassPopup from '../../get_animation_class';
import processCampaignTextsPopup from '../../process_campaign_texts';
import getStylesPopup from '../../get_styles';

import getMobileStyles from './styles/get_mobile';
import getTabletStyles from './styles/get_tablet';
import getDesktopStyles from './styles/get_desktop';
import defineCustomPopupElementDebut from './define_custom_popup_element';

const TemplateDebut = ({ campaign, preview, onStyleChange = () => {} }) => {
  const renderedProduct = getRenderedProductPopup(campaign);
  const mobileStyles = getMobileStyles(campaign, preview);
  const tabletStyles = getTabletStyles(campaign, preview);
  const desktopStyles = getDesktopStyles(campaign, preview);
  const styles = getStylesPopup(
    campaign,
    preview,
    mobileStyles,
    tabletStyles,
    desktopStyles
  );
  useEffect(() => {
    // initialising the
    try {
      // eslint-disable-next-line no-eval
      eval(defineCustomPopupElementDebut);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, []);
  useEffect(() => {
    onStyleChange(styles);
  }, [styles, onStyleChange]);
  return (
    <>
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
            <TitleProduct>{renderedProduct.title}</TitleProduct>
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
                <VariantsProduct options={renderedProduct.options} />
              </div>
              <div id="salestorm-quantity-selection">
                <input defaultValue={1} type="number" />
                <div id="salestorm-quantity-selection-plus">
                  <Icon source={PlusMinor} />
                </div>
                <div id="salestorm-quantity-selection-minus">
                  <Icon source={MinusMinor} />
                </div>
              </div>
              <button
                id="salestorm-claim-offer-button"
                type="button"
                dangerouslySetInnerHTML={{
                  __html: processCampaignTextsPopup(
                    `<span id="salestorm-campaign-text-addToCartAction">${campaign.texts.addToCartAction}</span>
                    <span id="salestorm-campaign-text-addToCartUnavailableVariation" class="d-none">${campaign.texts.addToCartUnavailableVariation}</span>`
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
          <DescriptionProduct
            descriptionHtml={renderedProduct.descriptionHtml}
          />
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
    </>
  );
};

export default TemplateDebut;
