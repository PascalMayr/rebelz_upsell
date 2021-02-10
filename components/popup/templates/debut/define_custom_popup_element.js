import processCampaignTextsPopup from '../../process_campaign_texts';

const defineCustomPopupElementDebut = (customJS) => `
  class SalestormPopupComponent extends HTMLElement {

    constructor() {
      super();
      this.setupShadow();
    }

    static get observedAttributes() {
      return ['visible', 'product', 'multicurrency', 'texts', 'animation'];
    }

    attributeChangedCallback(name, _oldValue, newValue) {
      if (name === "visible") {
        if (newValue === "true") {
          this.shadowRoot.querySelector('#salestorm-overlay-container').style.display = 'flex';
        }
        else {
          this.hidePopup();
        }
      }
      if (name === 'product') {
        this.updateProduct(JSON.parse(newValue));
      }
      if (name === 'texts') {
        this.updateTexts(JSON.parse(newValue));
      }
      if (name === 'animation') {
        this.updateAnimation(newValue);
      }
    }

    connectedCallback() {
      window.Salestorm = {
        hidePopup: new Event('salestorm-hide-popup-event')
      };
      this.setupClickListeners();
      this.setupKeyListeners();
      this.setupHidePopupListener();
      this.setupChangeListeners();
    }

    disconnectedCallback() {
      this.removeClickListeners();
      this.removeKeyListeners();
      this.removeHidePopupListener();
      this.removeChangeListeners();
    }

    setupShadow() {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = this.innerHTML;
    }

    toggleDescriptionElement(element) {
      element.classList.toggle('d-none');
    }

    getDetailsMessageElement() {
      return this.shadowRoot.querySelector('#salestorm-campaign-text-seeProductDetailsAction');
    }

    getCloseButtonElement() {
      return this.shadowRoot.querySelector('#salestorm-popup-close');
    }

    getClaimOfferButtonElement() {
      return this.shadowRoot.querySelector('#salestorm-claim-offer-button');
    }

    getProductDescriptionElement() {
      return this.shadowRoot.querySelector('#salestorm-product-description');
    }

    getDismissActionElement() {
      return this.shadowRoot.querySelector('#salestorm-campaign-text-dismissAction');
    }

    getCheckoutElement() {
      return this.shadowRoot.querySelector('#salestorm-popup-footer-checkout-action');
    }

    getSelectElements() {
      return this.shadowRoot.querySelectorAll('.salestorm-product-select');
    }

    getAddToCartActionElement() {
      return this.shadowRoot.querySelector('#salestorm-campaign-text-addToCartAction');
    }

    getAddToCartUnavailableVariationElement() {
      return this.shadowRoot.querySelector('#salestorm-campaign-text-addToCartUnavailableVariation');
    }

    getQuantityInput() {
      return this.shadowRoot.querySelector('#salestorm-quantity-selection > input');
    }

    setupClickListeners() {
      const productDetailsMessage = this.getDetailsMessageElement();
      const descriptionElement = this.getProductDescriptionElement();
      if (descriptionElement && productDetailsMessage) {
        productDetailsMessage.addEventListener('click', () => this.toggleDescriptionElement(descriptionElement));
      }

      const closeButton = this.getCloseButtonElement();
      closeButton && closeButton.addEventListener('click', this.hidePopup);
      const dismissAction = this.getDismissActionElement();
      dismissAction && dismissAction.addEventListener('click', this.hidePopup);
      const checkoutAction = this.getCheckoutElement();
      checkoutAction && checkoutAction.addEventListener('click', this.hidePopup);

      const quantityInput = this.getQuantityInput();
      if (quantityInput) {
        const minus = this.shadowRoot.querySelector('#salestorm-quantity-selection-minus');
        minus.addEventListener('click', () => {
          if (quantityInput.value > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
          }
        })
        const plus = this.shadowRoot.querySelector('#salestorm-quantity-selection-plus');
        plus.addEventListener('click', () => {
          quantityInput.value = parseInt(quantityInput.value) + 1;
        })
      }
    }

    removeClickListeners() {
      const productDetailsMessage = this.getDetailsMessageElement();
      const descriptionElement = this.getProductDescriptionElement();
      if (descriptionElement && productDetailsMessage) {
        productDetailsMessage.removeEventListener('click', this.toggleDescriptionElement);
      }

      const closeButton = this.getCloseButtonElement();
      closeButton && closeButton.removeEventListener('click', this.hidePopup);
      const dismissAction = this.getDismissActionElement();
      dismissAction && dismissAction.removeEventListener('click', this.hidePopup);
      const checkoutAction = this.getCheckoutElement();
      checkoutAction && checkoutAction.removeEventListener('click', this.hidePopup);
    }

    setupKeyListeners() {
      document.addEventListener("keydown", event => {
        if(event.key === "Escape") {
          this.hidePopup();
        }
      });
    }

    removeKeyListeners() {
      document.removeEventListener("keydown", event => {
        if(event.key === "Escape") {
          this.hidePopup();
        }
      });
    }

    setupHidePopupListener() {
      document.addEventListener(window.Salestorm.hidePopup.type, () => {
        this.shadowRoot.querySelector('#salestorm-overlay-container').style.display = 'none';
      })
    }

    removeHidePopupListener() {
      document.removeEventListener(window.Salestorm.hidePopup.type, () => {
        this.shadowRoot.querySelector('#salestorm-overlay-container').style.display = 'none';
      })
    }

    setupChangeListeners() {
      const quantityInput = this.getQuantityInput();
      if (quantityInput) {
        quantityInput.addEventListener('change', (event) => {
          const newValue = event.target.value;
          if (newValue < 1) {
            event.target.value = 1;
            event.target.setAttribute('value', 1);
          }
          else {
            event.target.setAttribute('value', newValue);
          }
        })
      }
    }

    removeChangeListeners() {
      const quantityInput = this.getQuantityInput();
      if (quantityInput) {
        quantityInput.removeEventListener('change', (event) => {
          const newValue = event.target.value;
          if (newValue < 1) {
            event.target.value = 1;
            event.target.setAttribute('value', 1);
          }
          else {
            event.target.setAttribute('value', newValue);
          }
        })
      }
    }

    hidePopup() {
      document.dispatchEvent(window.Salestorm.hidePopup);
    }

    setSelectedProductVariant(product) {
      const sortStringArrayAlphabetically = array => array.sort((a, b) => a.length - b.length);
      const currentRenderedSelects = Array.from(this.getSelectElements());
      const currentSelectionState = currentRenderedSelects.map(selectElement => selectElement.value);
      const selectedVariant = product.variants.edges.find(variant => {
        const variantOptionValues = variant.node.selectedOptions.map(selectedOption => selectedOption.value);
        return JSON.stringify(sortStringArrayAlphabetically(variantOptionValues)) === JSON.stringify(sortStringArrayAlphabetically(currentSelectionState));
      });

      const claimOfferButton = this.getClaimOfferButtonElement();
      if (selectedVariant) {
        if (selectedVariant.node && selectedVariant.node.image) {
          this.shadowRoot.querySelector('#salestorm-product-image').style.backgroundImage = "url("+selectedVariant.node.image.transformedSrc+")";
        }
        claimOfferButton.classList.disable = false;
        claimOfferButton.classList.remove('offer-button-disabled');
        this.getAddToCartActionElement().classList.remove('d-none');
        this.getAddToCartUnavailableVariationElement().classList.add('d-none');
      }
      else {
        if (currentRenderedSelects.length > 0) {
          claimOfferButton.classList.disable = true;
          claimOfferButton.classList.add('offer-button-disabled');
          this.getAddToCartActionElement().classList.add('d-none');
          this.getAddToCartUnavailableVariationElement().classList.remove('d-none');
        }
      }
    }

    getDisplayedStoreCurrencyCode() {
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

    updatePrices(product) {
      if (Boolean(product.discount)) {
        const salestormPrices = this.shadowRoot.querySelectorAll('.salestorm-price');
        const multiCurrencySupport = this.getAttribute("multicurrency") === "true";
        if (product.discount.type !== "%") {
          const baseCurrencyCode = product.discount.type;
          window.Salestorm.currentCurrencyCode = (multiCurrencySupport && this.getDisplayedStoreCurrencyCode())|| baseCurrencyCode;

          const currencyFormatter = new Intl.NumberFormat([], {
            style: 'currency',
            currency: window.Salestorm.currentCurrencyCode,
            currencyDisplay: 'symbol',
            maximumSignificantDigits: 3
          });

          salestormPrices.forEach(priceElement => {
            const priceValue = product.discount.value || 0;
            let convertedPriceValue = priceValue;
            if (window.Currency && window.Currency.rates && window.Currency.convert && multiCurrencySupport) {
              convertedPriceValue = Math.round(window.Currency.convert(priceValue, baseCurrencyCode, window.Salestorm.currentCurrencyCode));
            }
            priceElement.innerText = currencyFormatter.format(convertedPriceValue);
          });
        }
        else {
          salestormPrices.forEach(priceElement => {
            priceElement.innerText = product.discount.value + "%";
          });
        }
      }
    }

    updateProduct(product) {
      const elementUpdateSelectors = ['#salestorm-product-title', '#salestorm-product-variants', '#salestorm-product-description'];
      for (let elementUpdateSelector of elementUpdateSelectors) {
        const updatedNode = document.querySelector(elementUpdateSelector);
        const oldNode = this.shadowRoot.querySelector(elementUpdateSelector);
        if (updatedNode && oldNode) {
          oldNode.replaceWith(updatedNode);
        }
      }

      if (product) {
        const mainProductImage = product.images.edges.length > 0 && product.images.edges[0].node.transformedSrc;
        if (mainProductImage) {
          this.shadowRoot.querySelector('#salestorm-product-image').style.backgroundImage = "url("+mainProductImage+")";
        } else {
          this.shadowRoot.querySelector('#salestorm-product-image').style.backgroundImage = "";
        }
        if (product.descriptionHtml === '') {
          this.shadowRoot.querySelector('#salestorm-campaign-text-seeProductDetailsAction').style.display = 'none';
        } else {
          this.shadowRoot.querySelector('#salestorm-campaign-text-seeProductDetailsAction').style.display = 'block';
        }
        this.setSelectedProductVariant(product);
        this.shadowRoot.querySelectorAll('.salestorm-product-select').forEach(selectElement => {
          selectElement.addEventListener('change', () => {
            const selectedValue = selectElement.value;
            this.setSelectedProductVariant(product);
          })
        });
      }

      this.updatePrices(product);
    }

    updateTexts(texts) {
      ${processCampaignTextsPopup.toString()}
      Object.keys(texts).forEach((textKey) => {
        const campaignTextElement = this.shadowRoot.querySelector(
          "#salestorm-campaign-text-" + textKey
        );
        if (
          campaignTextElement &&
          campaignTextElement.innerHTML !== texts[textKey]
        ) {
          campaignTextElement.innerHTML = processCampaignTextsPopup(
            texts[textKey]
          );
        }
      });
      const product = this.getAttribute('product');
      this.updatePrices(JSON.parse(product));
    }

    updateAnimation(animation) {
      this.shadowRoot.querySelector('#salestorm-popup').className = animation;
    }

  }
  if (!customElements.get('salestorm-popup')) {
    customElements.define('salestorm-popup', SalestormPopupComponent);
  }
  ${customJS}
`;

export default defineCustomPopupElementDebut;
