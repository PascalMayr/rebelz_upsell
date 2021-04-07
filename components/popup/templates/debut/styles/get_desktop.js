import tinycolor from 'tinycolor2';

import convertStyleObjectToStyleStringUtil from '../../../utils/convert_style_object_to_style_string';

const getDesktopStyles = (styles, preview) => {
  return `
  #salestorm-overlay-container div {
    box-sizing: border-box;
    font-weight: 400;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }
  #salestorm-overlay-container * {
    -webkit-tap-highlight-color: ${tinycolor(
      styles.primaryButtons.color
    ).setAlpha(0.5)};
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
    font-family: ${styles.popup.fontFamily};
    color: ${styles.popup.color};
  }
  #salestorm-overlay-container p {
    margin: 0px;
    padding: 0px;
    font-weight: 400;
    font-family: ${styles.popup.fontFamily};
    color: ${styles.popup.color};
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }
  #salestorm-overlay-container {
    position: ${preview === undefined ? 'fixed' : 'relative'};
    contain: layout;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 25px !important;
    width: 100%;
    height: ${preview === undefined ? '100vh' : '100%'};
    z-index: 99999;
    transition: 0.25s ease;
    ${convertStyleObjectToStyleStringUtil(styles.overlay)};
  }
  #salestorm-popup::-webkit-scrollbar {
    display: none;
  }
  #salestorm-popup {
    contain: layout;
    z-index: 100000;
    transition: 0.25s ease;
    overflow-y: scroll;
    font-family: ${styles.popup.fontFamily};
    color: ${styles.popup.color};
    -ms-overflow-style: none;
    scrollbar-width: none;
    ${convertStyleObjectToStyleStringUtil(styles.popup)};
  }
  #salestorm-popup-close, #salestorm-popup-skip {
    contain: layout;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.25s ease;
    ${convertStyleObjectToStyleStringUtil(styles.secondaryButtons)};
  }
  #salestorm-popup-skip {
    margin-right: 1em;
    margin-left: 5px;
  }
  #salestorm-popup-close > span {
    width: 16px;
    height: 16px;
    margin: 0 auto;
  }
  #salestorm-popup-skip > span {
    width: 16px;
    height: 16px;
    margin: 0 auto;
  }
  #salestorm-popup-close > span > svg {
    width: 100%;
    margin-bottom: 2.5px;
  }
  #salestorm-popup-skip > span > svg {
    width: 100%;
    margin-bottom: 2.5px;
  }
  #salestorm-popup-close:hover {
    background-color: ${tinycolor(
      styles.secondaryButtons.backgroundColor
    ).lighten(10)};
  }
  #salestorm-popup-skip:hover {
    background-color: ${tinycolor(
      styles.secondaryButtons.backgroundColor
    ).lighten(10)};
  }
  #salestorm-popup-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
  }
  #salestorm-product-title {
    font-size: 23px;
    max-width: 75%;
    color: ${styles.popup.color};
    text-decoration: none;
  }
  #salestorm-popup-footer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
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
    margin-left: 0.2em;
    width: 15px;
    padding-top: 4.5px;
    fill: ${styles.popup.color};
  }
  #salestorm-product {
    padding: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  #salestorm-product-image-container {
    width: 254px;
    text-decoration: none;
    color: ${styles.popup.color};
    position: relative;
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
    text-align: center;
  }
  #salestorm-product-action-container > h3 {
    font-size: 23px;
    font-weight: bold;
    margin-top: 0px;
  }
  #salestorm-product-action-container > * {
    margin-bottom: 12px;
  }
  #salestorm-product-action-container > button {
    margin-bottom: 16px;
  }
  #salestorm-product-action-container > p {
    margin-bottom: 12px;
    font-size: 16px;
  }
  .salestorm-product-select-container {
    position: relative;
    margin-bottom: 10px;
    border-radius: 3px;
    border-color: inherit;
    border-width: 0px;
    border-style: solid;
  }
  .salestorm-product-select {
    padding: 10px 16px;
    background-color: ${tinycolor(styles.popup.backgroundColor).darken(10)};
    background-image: url();
    width: 100%;
    border-width: 0px;
    border-radius: 3px;
    cursor: pointer;
    color: inherit;
    font-family: inherit;
    font-size: 14px;
    z-index: 100002;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    text-indent: 0.01px;
    text-overflow: '';
  }
  .salestorm-product-select-arrow > span {
    position: absolute;
    top: 22.5%;
    right: 5px;
    width: 21px;
    height: 21px;
    fill: ${styles.popup.color};
  }
  .salestorm-product-select > option {
    background-color: ${styles.popup.backgroundColor};
    color: ${styles.popup.color};
  }
  #salestorm-claim-offer-button {
    opacity: 1;
    width: 100%;
    padding: 16px 24px;
    font-size: 17px;
    font-weight: bold;
    font-family: ${styles.primaryButtons.fontFamily};
    color: ${styles.primaryButtons.color};
    cursor: pointer;
    transition: 0.25s ease;
    ${convertStyleObjectToStyleStringUtil(styles.primaryButtons)};
  }
  #salestorm-claim-offer-button:hover {
    background-color: ${tinycolor(styles.primaryButtons.backgroundColor).darken(
      10
    )};
  }
  .offer-button-disabled {
    opacity: 0.7 !important;
    cursor: default !important;
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
  #salestorm-quantity-selection {
    position: relative;
    text-align: left;
  }
  #salestorm-quantity-selection > input {
    margin: 0px;
    border: 0px;
    position: relative;
    border-radius: 3px;
    border-color: inherit;
    border-width: 0px;
    border-style: solid;
    padding: 10px 16px;
    box-sizing: border-box;
    width: 100%;
    background-color: ${tinycolor(styles.popup.backgroundColor).darken(10)};
    color: ${styles.popup.color};
    text-align: center;
    font-size: 16px;
  }
  #salestorm-quantity-selection-plus {
    cursor: pointer;
  }
  #salestorm-quantity-selection-minus {
    cursor: pointer;
  }
  #salestorm-quantity-selection-plus .Polaris-Icon {
    position: absolute;
    top: 20%;
    right: 10px;
    width: 21px;
    height: 21px;
    fill: ${styles.popup.color};
  }
  #salestorm-quantity-selection-minus .Polaris-Icon {
    position: absolute;
    top: 20%;
    left: 10px;
    width: 21px;
    height: 21px;
    fill: ${styles.popup.color};
  }
  #salestorm-campaign-text-countdown {
    font-size: 18px;
    text-align: center;
  }
  #salestorm-progress-bar-container {
    width: 100%;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 16px;
    display: flex;
    justify-content: space-between;
  }
  .salestorm-progress-bar-wrapper {
    background-color: ${tinycolor(styles.popup.backgroundColor).lighten(10)};
    border-radius: 3px;
  }
  .salestorm-progress-bar {
    height: 5px;
    width: 0px;
    border-radius: 3px;
    transition: all ease 0.25s;
    background-color: ${styles.primaryButtons.backgroundColor};
  }
  #salestorm-campaign-text-title {
    line-height: 35px;
  }
  #salestorm-product-image-slider {
    position: absolute;
    top: 47.5%;
    left: 0px;
    display: flex;
    justify-content: space-between;
    padding-right: 5px;
    padding-left: 5px;
    width: 100%;
  }
  #salestorm-product-image-slider-left {
    cursor: pointer;
    height: 100%;
  }
  #salestorm-product-image-slider-left .Polaris-Icon > svg {
    width: 20px;
    opacity: 0.5;
  }
  #salestorm-product-image-slider-right {
    cursor: pointer;
    height: 100%;
  }
  #salestorm-product-image-slider-right .Polaris-Icon > svg {
    width: 20px;
    opacity: 0.5;
  }
  #salestorm-popup-header-actions {
    display: flex;
  }
  .loader {
    border: 4px solid ${tinycolor(styles.primaryButtons.backgroundColor).darken(
      40
    )};
    border-radius: 50%;
    border-top: 4px solid ${tinycolor(styles.primaryButtons.color).lighten(10)};
    width: 25px;
    height: 25px;
    -webkit-animation: spin 2s linear infinite; /* Safari */
    animation: spin 1.25s linear infinite;
    margin: 0 auto;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
};

export default getDesktopStyles;
