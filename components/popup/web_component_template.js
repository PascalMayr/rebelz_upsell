import React from 'react';
import {
  MobileCancelMajor,
  SelectMinor,
  ArrowRightMinor,
} from '@shopify/polaris-icons';
import { Icon } from '@shopify/polaris';

import PlaceholderPreview from '../campaigns/new/preview/placeholder';

const processCampaignTexts = (text) =>
  text.replace('{{Discount}}', '<span class="salestorm-price"></span>');

const WebComponentTemplatePopup = ({
  campaign,
  styles,
  // eslint-disable-next-line no-empty-function
  setRerenderButton = () => {},
}) => {
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
          className={`animate__animated ${campaign.animation.type} animate__delay-${campaign.animation.delay}s animate__${campaign.animation.speed}`}
        >
          <div id="salestorm-popup-header">
            <div id="salestorm-popup-header-title">{renderedProduct.title}</div>
            <div
              id="salestorm-popup-close"
              onClick={setRerenderButton}
              onKeyDown={setRerenderButton}
            >
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
              {renderedProduct.options.map((option) => {
                if (option.name === 'Title') {
                  return null;
                } else {
                  return (
                    <div
                      className="salestorm-product-select-container"
                      key={`${option.name}-select-container`}
                    >
                      <select
                        className="salestorm-product-select"
                        key={`${option.name}-select`}
                      >
                        {option.values.map((value) => (
                          <option
                            value={value}
                            key={`${option.name}-${value}-select-option`}
                          >
                            {value}
                          </option>
                        ))}
                      </select>
                      <div
                        className="salestorm-product-select-arrow"
                        key={`${option.name}-select-arrow`}
                      >
                        <Icon
                          source={SelectMinor}
                          key={`${option.name}-select-arrow-icon`}
                        />
                      </div>
                    </div>
                  );
                }
              })}
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
          {renderedProduct.descriptionHtml !== '' && (
            <div
              id="salestorm-product-description"
              dangerouslySetInnerHTML={{
                __html: renderedProduct.descriptionHtml,
              }}
            />
          )}
          <div id="salestorm-popup-footer">
            <div
              id="salestorm-campaign-text-dismissAction"
              dangerouslySetInnerHTML={{
                __html: processCampaignTexts(campaign.texts.dismissAction),
              }}
              onClick={setRerenderButton}
              onKeyDown={setRerenderButton}
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

export { processCampaignTexts };
export default WebComponentTemplatePopup;
