import tinycolor from 'tinycolor2';

const getTabletStyles = (campaign) => {
  const { styles } = campaign;
  return `
    #salestorm-product {
      flex-direction: column;
      padding: 24px;
      padding-bottom: 0px;
    }
    #salestorm-product-image {
      padding-top: 300px;
    }
    #salestorm-product-image-container {
      width: 100%;
      height: 300px;
    }
    #salestorm-product-action-container {
      width: 100%;
      height: initial;
      padding-top: 16px;
    }
    #salestorm-product-action-container > h3 {
      font-size: 18px !important;
    }
    #salestorm-product-action-container > * {
      margin-bottom: 10px !important;
    }
    #salestorm-product-action-container > button {
      margin-top: 8px !important;
      margin-bottom: 8px !important;
    }
    #salestorm-product-action-container > p {
      margin-bottom: 10px !important;
      margin-top: 10px !important;
    }
    #salestorm-campaign-text-dismissAction {
      display: none;
    }
    #salestorm-popup-footer-checkout-action {
      margin: 0 auto !important;
      font-size: 16px !important;
    }
    #salestorm-product-title {
      max-width: 75% !important;
    }
    #salestorm-product-description {
      padding: 0px 16px !important;
      margin-top: 6px !important;
      text-align: center !important;
    }
    #salestorm-overlay-container {
      contain: layout;
      justify-content: center !important;
      align-items: center !important;
      width: 100% !important;
      height: 100% !important;
      z-index: 99999 !important;
    }
    #salestorm-popup {
      contain: layout;
      z-index: 100000 !important;
      max-height: 100% !important;
      width: 100% !important;
      -webkit-tap-highlight-color: ${tinycolor(
        styles.popup.backgroundColor
      ).lighten(10)};
    }
  `;
};

export default getTabletStyles;
