import tinycolor from 'tinycolor2';

import convertStyleObjectToStyleStringPopup from '../../../convert_style_object_to_style_string';

const getDesktopStyles = (campaign, preview) => {
  const { styles } = campaign;
  return `
  #salestorm-overlay-container div {
    box-sizing: border-box;
    font-weight: 400;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }
  #salestorm-overlay-container * {
    -webkit-tap-highlight-color: ${styles.primaryButtons.backgroundColor};
  }
  #salestorm-overlay-container *:focus {
    outline: none;
  }
  #salestorm-overlay-container *::selection {
    background-color: ${styles.primaryButtons.backgroundColor};
  }
  #salestorm-overlay-container h3 {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    font-family: ${styles.popup.fontFamily} !important;
    color: ${styles.popup.color} !important;
  }
  #salestorm-overlay-container p {
    margin: 0px !important;
    padding: 0px !important;
    font-weight: 400;
    line-height: 20px !important;
    font-family: ${styles.popup.fontFamily} !important;
    color: ${styles.popup.color} !important;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }
  #salestorm-overlay-container {
    contain: layout;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: ${preview === undefined ? '100vh' : '100%'};
    z-index: 99999 !important;
    transition: 0.25s ease;
    ${convertStyleObjectToStyleStringPopup(styles.overlay)};
  }
  #salestorm-popup::-webkit-scrollbar {
    display: none;
  }
  #salestorm-popup {
    contain: layout;
    z-index: 100000 !important;
    transition: 0.25s ease;
    overflow-y: scroll;
    font-family: ${styles.popup.fontFamily} !important;
    color: ${styles.popup.color} !important;
    -ms-overflow-style: none;
    scrollbar-width: none;
    ${convertStyleObjectToStyleStringPopup(styles.popup)};
  }
  #salestorm-popup-close {
    contain: layout;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.25s ease;
    ${convertStyleObjectToStyleStringPopup(styles.secondaryButtons)};
  }
  #salestorm-popup-close > span {
    width: 16px !important;
    height: 16px !important;
    margin: 0 auto !important;
  }
  #salestorm-popup-close > span > svg {
    width: 100% !important;
  }
  #salestorm-popup-close:hover {
    background-color: ${tinycolor(
      styles.secondaryButtons.backgroundColor
    ).lighten(10)};
  }
  #salestorm-popup-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px !important;
  }
  #salestorm-product-title {
    font-size: 23px !important;
    max-width: 75% !important;
  }
  #salestorm-popup-footer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px !important;
  }
  #salestorm-campaign-text-dismissAction {
    cursor: pointer;
  }
  #salestorm-popup-footer-checkout-action {
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  #salestorm-popup-footer-checkout-action .Polaris-Icon {
    margin-left: 0.2em !important;
    width: 15px !important;
    padding-top: 4.5px !important;
    fill: ${styles.popup.color} !important;
  }
  #salestorm-product {
    padding: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  #salestorm-product-image-container {
    width: 254px;
    height: 254px;
  }
  #salestorm-product-image {
    padding-top: 254px;
    border-radius: 3px;
    background-color: ${tinycolor(styles.popup.backgroundColor).lighten(10)};
    background-size: cover;
    background-position: center;
  }
  #salestorm-product-action-container {
    width: 254px;
    text-align: center !important;
  }
  #salestorm-product-action-container > h3 {
    font-size: 23px !important;
    font-weight: bold;
    margin-top: 0px !important;
  }
  #salestorm-product-action-container > * {
    margin-bottom: 12px !important;
  }
  #salestorm-product-action-container > button {
    margin-bottom: 16px !important;
  }
  #salestorm-product-action-container > p {
    margin-bottom: 12px !important;
    font-size: 16px !important;
  }
  .salestorm-product-select-container {
    position: relative !important;
    margin-bottom: 10px;
    border-radius: 3px;
    border-color: inherit;
    border-width: 0px;
    border-style: solid;
  }
  .salestorm-product-select {
    padding: 10px 16px;
    background-color: ${tinycolor(styles.popup.backgroundColor).darken(10)};
    background-image: url() !important;
    width: 100%;
    border-width: 0px;
    border-radius: 3px;
    cursor: pointer;
    color: inherit;
    font-family: inherit;
    font-size: 14px !important;
    z-index: 100002 !important;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    text-indent: 0.01px;
    text-overflow: '';
  }
  .salestorm-product-select-arrow > span {
    position: absolute !important;
    top: 22.5% !important;
    right: 5px !important;
    width: 21px !important;
    height: 21px !important;
    fill: ${styles.popup.color} !important;
  }
  .salestorm-product-select > option {
    background-color: ${styles.popup.backgroundColor} !important;
    color: ${styles.popup.color} !important;
  }
  #salestorm-campaign-text-addToCartAction {
    opacity: 1;
    width: 100%;
    padding: 16px 24px;
    font-size: 17px;
    font-weight: bold;
    font-family: ${campaign.styles.primaryButtons.fontFamily} !important;
    color: ${campaign.styles.primaryButtons.color} !important;
    cursor: pointer;
    transition: 0.25s ease;
    ${convertStyleObjectToStyleStringPopup(campaign.styles.primaryButtons)};
  }
  #salestorm-campaign-text-addToCartAction:hover {
    background-color: ${tinycolor(styles.primaryButtons.backgroundColor).darken(
      10
    )};
  }
  .offer-button-disabled {
    opacity: 0.7 !important;
    cursor: default !important;
  }
  .offer-button-disabled:hover {
    background-color: ${styles.primaryButtons.backgroundColor} !important;
  }
  #salestorm-campaign-text-seeProductDetailsAction{
    color: inherit;
    text-decoration: underline;
    cursor: pointer;
  }
  #salestorm-product-description {
    padding: 16px 30px;
    padding-top: 0px;
  }
`;
};

export default getDesktopStyles;
