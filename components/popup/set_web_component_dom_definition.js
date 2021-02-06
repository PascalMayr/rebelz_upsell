const setWebComponentDomDefinitionPopup = (templateID) => `
  class SalestormPopupComponent extends HTMLElement {
    shadow;

    static get observedAttributes() {
      return ['visible'];
    }

    constructor() {
      super();

      this.setupShadow();
    }

    connectedCallback() {
      window.Salestorm = {
        popupId: "${templateID}",
        hidePopup: new Event('salestorm-hide-popup-event'),
        hideProductDetails: new Event('salestorm-hide-product-details'),
      };
      this.setupClickListeners();
      this.setupKeyListeners();
    }

    disconnectedCallback() {
      // remove events
    }

    adoptedCallback() {}

    attributeChangedCallback(name, _oldValue, newValue) {
      if (name === "visible") {
        if (newValue === "true") {
          this.shadow.querySelector('#salestorm-overlay-container').style.display = 'flex';
        }
        else {
          this.hidePopup();
        }
      }
    }

    setupShadow() {
      this.shadow = this.attachShadow({ mode: 'open' });
      const template = document.getElementById("${templateID}");
      if (template) {
        this.shadow.appendChild(template.content.cloneNode(true));
      }
    }

    setupClickListeners() {
      const productDetailsMessage = this.shadow.querySelector('#salestorm-campaign-text-seeProductDetailsAction');
      const descriptionElement = this.shadow.querySelector('#salestorm-product-description');
      if (descriptionElement && productDetailsMessage) {
        descriptionElement.style.display = 'none';
        productDetailsMessage.addEventListener('click', () => {
          document.dispatchEvent(window.Salestorm.hideProductDetails);
          descriptionElement.style.display = descriptionElement.style.display === 'block' ? 'none' : 'block';
        });
      }

      const closeButton = this.shadow.querySelector('#salestorm-popup-close');
      closeButton && closeButton.addEventListener('click', () => {
        this.hidePopup();
      });
      const dismissAction = this.shadow.querySelector('#salestorm-campaign-text-dismissAction');
      dismissAction && dismissAction.addEventListener('click', () => {
        this.hidePopup();
      });
      const checkoutAction = this.shadow.querySelector('#salestorm-popup-footer-checkout-action');
      checkoutAction && checkoutAction.addEventListener('click', () => {
        this.hidePopup();
      });
    }

    setupKeyListeners() {
      document.addEventListener("keydown", event => {
        if(event.key === "Escape") {
          this.hidePopup();
        }
      });
    }

    hidePopup() {
      document.dispatchEvent(window.Salestorm.hidePopup);
      this.shadow.querySelector('#salestorm-overlay-container').style.display = 'none';
    }

    findDisplayCurrencyCode() {
      if (window.afterpay_shop_currency && window.afterpay_shop_currency !== "") {
        return window.afterpay_shop_currency;
      }
      if (window.shop_currency && window.shop_currency !== "") {
        return window.shop_currency;
      }
      if (window.mlvedaShopCurrency && window.mlvedaShopCurrency !== "") {
        return window.mlvedaShopCurrency;
      }
      if (window.Currency && window.Currency.currentCurrency && window.Currency.currentCurrency !== "") {
        return window.Currency.currentCurrency;
      }
      if (window.Currency && window.Currency.shop_currency && window.Currency.shop_currency !== "") {
        return window.Currency.shop_currency;
      }
      if (window.localStorage) {
        if (localStorage.getItem('currency') && localStorage.getItem('currency') !== "") {
          return localStorage.getItem('currency');
        }
        if (localStorage.getItem('GIP_USER_CURRENCY') && localStorage.getItem('GIP_USER_CURRENCY') !== "") {
          return localStorage.getItem('GIP_USER_CURRENCY');
        }
        if (localStorage.getItem('currencyWidget') && localStorage.getItem('currencyWidget') !== "") {
          return localStorage.getItem('currencyWidget');
        }
      }
      if (document.getElementById('baCurrSelector')) {
        return document.getElementById('baCurrSelector').value;
      }
      if (window.Shopify && window.Shopify.currency && window.Shopify.currency.active !== "") {
        return Shopify.currency.active;
      }
      return null;
    }

  }
  if (!customElements.get('salestorm-popup')) {
    customElements.define('salestorm-popup', SalestormPopupComponent);
  }
`;

export default setWebComponentDomDefinitionPopup
