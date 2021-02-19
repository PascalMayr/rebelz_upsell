import processCampaignTextsUtil from '../../utils/process_campaign_texts';

const customElement = (customJS) => `
  class SalestormPopupComponent extends HTMLElement {

    constructor() {
      super();
      this.setupShadow();
    }

    static get observedAttributes() {
      return ['visible', 'product', 'multicurrency', 'texts', 'animation', 'quantityeditable'];
    }

    getElement(selector) {
      return this.shadowRoot.querySelector(selector);
    }

    getElements(selector) {
      return this.shadowRoot.querySelectorAll(selector);
    }

    attributeChangedCallback(name, _oldValue, newValue) {
      switch(name) {
        case 'visible':
          if (newValue === "true") {
            this.getElement('#salestorm-overlay-container').style.display = 'flex';
          }
          else {
            this.hidePopup();
          };
        break;
        case 'product':
          this.updateProduct(JSON.parse(newValue));
        break;
        case 'texts':
          this.updateTexts(JSON.parse(newValue));
        break;
        case 'animation':
          this.updateAnimation(newValue);
        break;
        case 'quantityeditable':
          const quantityInputContainer = this.getElement('#salestorm-quantity-selection');
          if (newValue === "true") {
            quantityInputContainer.classList.remove('d-none');
          }
          else {
            quantityInputContainer.classList.add('d-none');
          }
        break;
        default:
          console.log('attribute not handled by any function');
        break;
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

    setupClickListeners() {
      const productDetailsMessage = this.getElement('#salestorm-campaign-text-seeProductDetailsAction');
      const descriptionElement = this.getElement('#salestorm-product-description');
      if (descriptionElement && productDetailsMessage) {
        productDetailsMessage.addEventListener('click', () => descriptionElement.classList.toggle('d-none'));
      }

      const closeButton = this.getElement('#salestorm-popup-close');
      closeButton && closeButton.addEventListener('click', this.hidePopup);
      const dismissAction = this.getElement('#salestorm-campaign-text-dismissAction');
      dismissAction && dismissAction.addEventListener('click', this.hidePopup);
      const checkoutAction = this.getElement('#salestorm-popup-footer-checkout-action');
      checkoutAction && checkoutAction.addEventListener('click', this.hidePopup);

      const quantityInput = this.getElement('#salestorm-quantity-selection > input');
      if (quantityInput) {
        const minus = this.getElement('#salestorm-quantity-selection-minus');
        minus.addEventListener('click', () => {
          if (quantityInput.value > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
          }
        })
        const plus = this.getElement('#salestorm-quantity-selection-plus');
        plus.addEventListener('click', () => {
          quantityInput.value = parseInt(quantityInput.value) + 1;
        })
      }
    }

    removeClickListeners() {
      const productDetailsMessage = this.getElement('#salestorm-campaign-text-seeProductDetailsAction');
      const descriptionElement = this.getElement('#salestorm-product-description');
      if (descriptionElement && productDetailsMessage) {
        productDetailsMessage.removeEventListener('click', () => descriptionElement.classList.toggle('d-none'));
      }

      const closeButton = this.getElement('#salestorm-popup-close');
      closeButton && closeButton.removeEventListener('click', this.hidePopup);
      const dismissAction = this.getElement('#salestorm-campaign-text-dismissAction');
      dismissAction && dismissAction.removeEventListener('click', this.hidePopup);
      const checkoutAction = this.getElement('#salestorm-popup-footer-checkout-action');
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
        this.getElement('#salestorm-overlay-container').style.display = 'none';
      })
    }

    removeHidePopupListener() {
      document.removeEventListener(window.Salestorm.hidePopup.type, () => {
        this.getElement('#salestorm-overlay-container').style.display = 'none';
      })
    }

    setupChangeListeners() {
      const quantityInput = this.getElement('#salestorm-quantity-selection > input');
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
      const quantityInput = this.getElement('#salestorm-quantity-selection > input');
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
      const currentRenderedSelects = Array.from(this.getElements('.cloned-select .salestorm-product-select'));
      const currentSelectionState = currentRenderedSelects.map(selectElement => selectElement.value);
      const selectedVariant = product.variants.edges.find(variant => {
        const variantOptionValues = variant.node.selectedOptions.map(selectedOption => selectedOption.value);
        return JSON.stringify(sortStringArrayAlphabetically(variantOptionValues)) === JSON.stringify(sortStringArrayAlphabetically(currentSelectionState));
      });
      const claimOfferButton = this.getElement('#salestorm-claim-offer-button');
      if (selectedVariant) {
        if (selectedVariant.node && selectedVariant.node.image) {
          this.getElement('#salestorm-product-image').style.backgroundImage = "url("+selectedVariant.node.image.transformedSrc+")";
        }
        claimOfferButton.classList.disable = false;
        claimOfferButton.classList.remove('offer-button-disabled');
        this.getElement('#salestorm-campaign-text-addToCartAction').classList.remove('d-none');
        this.getElement('#salestorm-campaign-text-addToCartUnavailableVariation').classList.add('d-none');
      }
      else {
        if (currentRenderedSelects.length > 0) {
          claimOfferButton.classList.disable = true;
          claimOfferButton.classList.add('offer-button-disabled');
          this.getElement('#salestorm-campaign-text-addToCartAction').classList.add('d-none');
          this.getElement('#salestorm-campaign-text-addToCartUnavailableVariation').classList.remove('d-none');
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
        const salestormPrices = this.getElements('.salestorm-price');
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
            let priceValue;
            if (priceElement.classList.contains('salestorm-discount-value')) {
              priceValue = product.discount.value || 0;
            }
            if (priceElement.classList.contains('salestorm-discounted-price')) {
              priceValue =  0;
            }
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

    updateProductLink(link) {
      const titleProduct = this.getElement('#salestorm-product-title');
      const productImageContainer = this.getElement('#salestorm-product-image-container');
      titleProduct.href = link;
      productImageContainer.href = link;
    }

    updateProduct(product) {
      if (product) {
        const variantsContainer = this.shadowRoot.querySelector('#salestorm-product-variants');
        const selectContainerTemplate = this.getElement('.salestorm-product-select-container');
        const oldSelectContainers = this.getElements('.cloned-select');
        for (const oldSelectContainer of oldSelectContainers) {
          oldSelectContainer.remove();
        }
        if (!product.hasOnlyDefaultVariant) {
          variantsContainer.classList.remove('d-none');
          product.options.forEach(option => {
            const currentSelectContainer = selectContainerTemplate.cloneNode(true);
            currentSelectContainer.classList.add('cloned-select');
            const currentSelect = currentSelectContainer.querySelector('.salestorm-product-select');
            option.values.forEach((value) => {
              const currentOption = document.createElement('option');
              currentOption.value = value;
              currentOption.innerHTML = value;
              currentSelect.appendChild(currentOption);
            });
            currentSelectContainer.appendChild(currentSelect);
            currentSelectContainer.classList.remove('d-none');
            variantsContainer.appendChild(currentSelectContainer);
          });
        } else {
          variantsContainer.classList.add('d-none');
        }
        this.getElement('#salestorm-product-title').innerHTML = product.title;
        const mainProductImage = product.featuredImage && product.featuredImage.transformedSrc;
        if (mainProductImage) {
          this.getElement('#salestorm-product-image').style.backgroundImage = "url("+mainProductImage+")";
        } else {
          this.getElement('#salestorm-product-image').style.backgroundImage = "";
        }
        if (product.descriptionHtml === '') {
          this.getElement('#salestorm-campaign-text-seeProductDetailsAction').style.display = 'none';
        } else {
          this.getElement('#salestorm-product-description').innerHTML = product.descriptionHtml;
          this.getElement('#salestorm-campaign-text-seeProductDetailsAction').style.display = 'block';
        }
        this.setSelectedProductVariant(product);
        this.getElements('.salestorm-product-select').forEach(selectElement => {
          selectElement.addEventListener('change', () => {
            const selectedValue = selectElement.value;
            this.setSelectedProductVariant(product);
          })
        });
      }
      this.updatePrices(product);
    }

    updateTexts(texts) {
      ${processCampaignTextsUtil.toString()}
      Object.keys(texts).forEach((textKey) => {
        const campaignTextElement = this.getElement(
          "#salestorm-campaign-text-" + textKey
        );
        if (
          campaignTextElement &&
          campaignTextElement.innerHTML !== texts[textKey]
        ) {
          campaignTextElement.innerHTML = processCampaignTextsUtil(
            texts[textKey]
          );
        }
      });
      const product = this.getAttribute('product');
      this.updatePrices(JSON.parse(product));
    }

    updateAnimation(animation) {
      this.getElement('#salestorm-popup').className = animation;
    }

  }
  if (!customElements.get('salestorm-popup')) {
    customElements.define('salestorm-popup', SalestormPopupComponent);
  }
  ${customJS}
`;

export default customElement;
