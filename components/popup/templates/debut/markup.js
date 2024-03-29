import React, { useEffect } from 'react';
import {
  MobileCancelMajor,
  ArrowRightMinor,
  PlusMinor,
  MinusMinor,
  CircleLeftMajor,
  CircleRightMajor,
  PaginationEndMinor,
} from '@shopify/polaris-icons';
import { Icon } from '@shopify/polaris';

import getRenderedProductUtil from '../../utils/get_rendered_product';
import getAnimationClassUtil from '../../utils/get_animation_class';
import processCampaignTextsUtil from '../../utils/process_campaign_texts';
import getStylesUtil from '../../utils/get_styles';

import DescriptionProduct from './product/description';
import VariantsProduct from './product/variants';
import TitleProduct from './product/title';
import getMobileStyles from './styles/get_mobile';
import getTabletStyles from './styles/get_tablet';
import getDesktopStyles from './styles/get_desktop';
import customElement from './custom_element';

const TemplateDebut = ({ campaign, preview, onStyleChange }) => {
  const renderedProduct = getRenderedProductUtil(campaign);
  const mobileStyles = getMobileStyles(campaign.styles, preview);
  const tabletStyles = getTabletStyles(campaign.styles, preview);
  const desktopStyles = getDesktopStyles(campaign.styles, preview);
  const styles = getStylesUtil(
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
      eval(customElement());
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, []);
  useEffect(() => {
    onStyleChange(styles);
  }, [styles, onStyleChange]);

  useEffect(() => {
    window.Salestorm.skipOffer = (popup) => {
      let currentOffer = parseInt(popup.getAttribute('currentoffer'), 10);
      currentOffer += 1;
      const newProduct = campaign.selling.products[currentOffer];
      if (newProduct) {
        popup.setAttribute('currentoffer', currentOffer);
        popup.setAttribute('product', JSON.stringify(newProduct));
      }
    };
  }, [campaign.id, campaign.selling.products]);
  return (
    <>
      <div id="salestorm-overlay-container">
        <style
          id="salestorm-popup-styles"
          dangerouslySetInnerHTML={{ __html: styles }}
        />
        <div
          id="salestorm-popup"
          className={getAnimationClassUtil(campaign.styles.animation)}
        >
          <div id="salestorm-progress-bar-container" />
          <div id="salestorm-popup-header">
            <TitleProduct>{renderedProduct.title}</TitleProduct>
            <div id="salestorm-popup-header-actions">
              <div id="salestorm-popup-skip" className="d-none">
                <Icon source={PaginationEndMinor} />
              </div>
              <div id="salestorm-popup-close">
                <Icon source={MobileCancelMajor} />
              </div>
            </div>
          </div>
          <div id="salestorm-product">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a id="salestorm-product-image-container">
              <div id="salestorm-product-image" />
              <div id="salestorm-product-image-slider">
                <div id="salestorm-product-image-slider-left">
                  <Icon source={CircleLeftMajor} />
                </div>
                <div id="salestorm-product-image-slider-right">
                  <Icon source={CircleRightMajor} />
                </div>
              </div>
            </a>
            <div id="salestorm-product-action-container">
              <div
                id="salestorm-campaign-text-countdown"
                dangerouslySetInnerHTML={{
                  __html: processCampaignTextsUtil(campaign.texts.countdown),
                }}
              />
              <h3
                dangerouslySetInnerHTML={{
                  __html: processCampaignTextsUtil(campaign.texts.title),
                }}
                id="salestorm-campaign-text-title"
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: processCampaignTextsUtil(campaign.texts.subtitle),
                }}
                id="salestorm-campaign-text-subtitle"
              />
              <div>
                <VariantsProduct />
              </div>
              <div id="salestorm-quantity-selection">
                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                <input
                  defaultValue={1}
                  type="number"
                  id="salestorm-product-quantity"
                />
                <div id="salestorm-quantity-selection-plus">
                  <Icon source={PlusMinor} />
                </div>
                <div id="salestorm-quantity-selection-minus">
                  <Icon source={MinusMinor} />
                </div>
              </div>
              {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
              <button
                id="salestorm-claim-offer-button"
                type="button"
                dangerouslySetInnerHTML={{
                  __html: processCampaignTextsUtil(
                    `<span id="salestorm-campaign-text-addToCartAction">${campaign.texts.addToCartAction}</span>
                    <span id="salestorm-campaign-text-addToCartUnavailable" class="d-none">${campaign.texts.addToCartUnavailable}</span>
                    <div id="salestorm-campaign-text-loader" class="loader d-none"></div>
                    `
                  ),
                }}
              />
              {renderedProduct.descriptionHtml !== '' && (
                <p
                  dangerouslySetInnerHTML={{
                    __html: processCampaignTextsUtil(
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
                __html: processCampaignTextsUtil(campaign.texts.dismissAction),
              }}
            />
            <div id="salestorm-popup-footer-checkout-action">
              <span
                dangerouslySetInnerHTML={{
                  __html: processCampaignTextsUtil(
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
