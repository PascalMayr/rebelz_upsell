const customElement = () => `
  class SalestormPopupComponent extends HTMLElement {
    constructor() {
      super();
      window.Salestorm = {};
      this.setupShadow();
    }

    static get observedAttributes() {
      return ['visible', 'product', 'texts', 'animation', 'quantityeditable', 'linktoproduct', 'multicurrency', 'enableoutofstockproducts', 'showcountdown', 'countdowntime', 'offers', 'currentoffer', 'showimageslider'];
    }

    getElement(selector) {
      return this.shadowRoot.querySelector(selector);
    }

    getElements(selector) {
      return this.shadowRoot.querySelectorAll(selector);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if(this.shadowRoot.childElementCount === 0) {
        this.shadowRoot.innerHTML = this.innerHTML;
      }
      switch(name) {
        case 'visible':
          if (newValue === "true") {
            this.showLoader(false);
            this.getElement('#salestorm-overlay-container').style.display = 'flex';
            this.resetCountdown();
            this.resetProgressBars();
            this.renderSkipOfferButton(parseInt(this.getAttribute('offers')));
          }
        break;
        case 'product':
          const product = JSON.parse(newValue);
          this.updateProduct(product);
          if (this.getAttribute('linktoproduct') === 'true') {
            this.updateProductLink("/products/"+product.handle);
          }
        break;
        case 'texts':
          clearInterval(this.countdownIntervalId);
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
        case 'linktoproduct':
          if(newValue === 'true') {
            const product = JSON.parse(this.getAttribute('product'));
            this.updateProductLink("/products/"+product.handle);
          } else {
            this.removeProductLink();
          }
        break;
        case 'showcountdown':
          if (newValue === 'true') {
            this.getElement('#salestorm-campaign-text-countdown').classList.remove('d-none');
            this.getElement('#salestorm-progress-bar-container').classList.remove('d-none');
          } else {
            clearInterval(this.countdownIntervalId);
            this.getElement('#salestorm-progress-bar-container').classList.add('d-none');
            this.getElement('#salestorm-campaign-text-countdown').classList.add('d-none');
          }
        break;
        case 'countdowntime':
          this.resetCountdown();
        break;
        case 'showimageslider':
          if (newValue === 'true' && this.images.length > 1) {
            this.getElement('#salestorm-product-image-slider').classList.remove('d-none');
          } else {
            this.getElement('#salestorm-product-image-slider').classList.add('d-none');
          }
          break;
        case 'offers':
          const offers = parseInt(newValue) === 0 ? 1 : parseInt(newValue);
          this.renderProgressBars(offers);
          this.renderSkipOfferButton(offers);
          break;
        case 'enableoutofstockproducts':
          if (newValue === "true") {
            this.enablePurchase();
          } else {
            this.disablePurchase();
          }
        default:
          console.log('attribute "' + name + '" not handled by any function');
        break;
      }
    }

    connectedCallback() {
      window.Salestorm = {
        hidePopup: new Event('salestorm-hide-popup-event'),
        skipOffer: () => {},
        claimOffer: () => {}
      };
      this.setupClickListeners();
      this.setupKeyListeners();
      this.setupHidePopupListener();
      this.setupChangeListeners();
      if (!this.getAttribute('preview')) {
        if (window.innerWidth > 950) {
          document.body.style.overflow = 'hidden';
        }
      }
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
        const product = this.getAttribute('product');
        minus.addEventListener('click', () => {
          if (quantityInput.value > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
          }
          this.updatePrices(JSON.parse(product), parseInt(quantityInput.value));
        });
        const plus = this.getElement('#salestorm-quantity-selection-plus');
        plus.addEventListener('click', () => {
          quantityInput.value = parseInt(quantityInput.value) + 1;
          this.updatePrices(JSON.parse(product), parseInt(quantityInput.value));
        });
      }

      const previous = () => {
        const currentIndex = this.images.findIndex(variantImage => variantImage === this.image);
        const nextIndex = currentIndex > 0 ? currentIndex - 1 : this.images.length -1;
        this.setImage(this.images[nextIndex]);
      };
      const leftSlider = this.getElement('#salestorm-product-image-slider-left');
      leftSlider.addEventListener('click', previous);
      const next = () => {
        const currentIndex = this.images.findIndex(variantImage => variantImage === this.image);
        const nextIndex = currentIndex + 1;
        const nextImage = this.images[nextIndex] ? this.images[nextIndex] : this.images[0];
        this.setImage(nextImage);
      };
      const rightSlider = this.getElement('#salestorm-product-image-slider-right');
      rightSlider.addEventListener('click', next);


      const skipOfferButton = this.getElement('#salestorm-popup-skip');
      skipOfferButton.addEventListener('click', () => {
        const displayedProgressBars = Array.from(this.getElements('.salestorm-progress-bar'));
        const currentOffer = parseInt(this.getAttribute('currentoffer'));
        const offers = parseInt(this.getAttribute('offers'));
        if ((currentOffer + 2) === offers) {
          skipOfferButton.classList.add('d-none');
        }
        displayedProgressBars[currentOffer].style.width = '100%';
        window.Salestorm.skipOffer(this);
      });

      const claimOfferButton = this.getElement('#salestorm-claim-offer-button');
      claimOfferButton.addEventListener('click', () => {
        let variantId;
        const enableoutofstockproducts = this.getAttribute('enableoutofstockproducts') === 'false';
        if (this.selectedVariant && this.selectedVariant.node) {
          if (!this.selectedVariant.node.availableForSale && enableoutofstockproducts) {
            return;
          } else {
            variantId = this.selectedVariant.node.legacyResourceId;
          }
        }
        let quantity = 1;
        const quantityInput = this.getElement('#salestorm-quantity-selection > input');
        if (quantityInput && quantityInput.value) {
          quantity = parseInt(quantityInput.value);
        }
        if (variantId) {
          const product = this.getAttribute('product');
          let strategy;
          if (product) {
            strategy = JSON.parse(product).strategy;
          }
          if (strategy) {
            this.showLoader(true);
            window.Salestorm.claimOffer(variantId, strategy, quantity);
          }
        }
      });
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
      });
    }

    removeHidePopupListener() {
      // hidePopup needs to be defined as it can be undefined during page change
      if (window.Salestorm.hidePopup) {
        document.removeEventListener(window.Salestorm.hidePopup.type, () => {
          this.getElement('#salestorm-overlay-container').style.display = 'none';
        });
      }
    }

    setupChangeListeners() {
      const quantityInput = this.getElement('#salestorm-quantity-selection > input');
      const product = this.getAttribute('product');
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
          this.updatePrices(JSON.parse(product), parseInt(event.target.value));
        });
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
        });
      }
    }

    hidePopup() {
      document.body.style.overflow = 'visible';
      clearInterval(this.countdownIntervalId);
      document.dispatchEvent(window.Salestorm.hidePopup);
    }

    showLoader(show = true) {
      const buttonText = this.getElement('#salestorm-campaign-text-addToCartAction');
      const loader = this.getElement('#salestorm-campaign-text-loader');
      if (buttonText) {
        if (show) {
          buttonText.classList.add('d-none');
          loader.classList.remove('d-none');
        } else {
          if (this.selectedVariant.node.availableForSale) {
            buttonText.classList.remove('d-none');
          }
          loader.classList.add('d-none');
        }
      }
    }

    disablePurchase() {
      if (!this.selectedVariant.node.availableForSale) {
        const claimOfferButton = this.getElement('#salestorm-claim-offer-button');
        claimOfferButton.setAttribute('disabled', 'true');
        claimOfferButton.classList.add('offer-button-disabled');
        this.getElement('#salestorm-campaign-text-addToCartAction').classList.add('d-none');
        this.getElement('#salestorm-campaign-text-addToCartUnavailable').classList.remove('d-none');
      }
    }

    enablePurchase() {
      const claimOfferButton = this.getElement('#salestorm-claim-offer-button');
      if (this.selectedVariant && this.selectedVariant.node && this.selectedVariant.node.image) {
        this.setImage(this.selectedVariant.node.image.transformedSrc);
      }
      claimOfferButton.removeAttribute('disabled');
      claimOfferButton.classList.remove('offer-button-disabled');
      this.getElement('#salestorm-campaign-text-addToCartAction').classList.remove('d-none');
      this.getElement('#salestorm-campaign-text-addToCartUnavailable').classList.add('d-none');
    }

    setSelectedProductVariant(product) {
      const sortStringArrayAlphabetically = array => array.sort((a, b) => a.length - b.length);
      const currentRenderedSelects = Array.from(this.getElements('.cloned-select .salestorm-product-select'));
      const currentSelectionState = currentRenderedSelects.map(selectElement => selectElement.value);
      this.selectedVariant = product.variants.edges.find(variant => {
        const variantOptionValues = variant.node.selectedOptions.map(selectedOption => selectedOption.value);
        return JSON.stringify(sortStringArrayAlphabetically(variantOptionValues)) === JSON.stringify(sortStringArrayAlphabetically(currentSelectionState));
      });
      if (product.hasOnlyDefaultVariant) {
        this.selectedVariant = product.variants.edges[0];
      }
      if (this.selectedVariant) {
        this.enablePurchase();
        const enableoutofstockproducts = this.getAttribute('enableoutofstockproducts') === 'false';
        if (enableoutofstockproducts && !this.selectedVariant.node.availableForSale) {
          this.disablePurchase();
        }
      }
      else {
        if (currentRenderedSelects.length > 0) {
          this.disablePurchase();
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
        return window.Shopify.currency.active;
      }
      return null;
    }

    createCurrencyFormatter(baseCurrencyCode) {
      const currencyFormatter = new Intl.NumberFormat([], {
        style: 'currency',
        currency: baseCurrencyCode || window.Salestorm.currentCurrencyCode,
        currencyDisplay: 'symbol',
        minimumFractionDigits: 2
      });
      return currencyFormatter;
    }

    updateDiscounts(product, quantity = 1) {
      if (Boolean(product.strategy.discount) && Boolean(this.selectedVariant)) {
        const discounts = this.getElements('.salestorm-discount');
        const discountedProductPrices = this.getElements('.salestorm-product-price-discounted');
        let discountedProductPriceValue;
        if (product.strategy.discount.type === "%") {
          discounts.forEach(discount => {
            discount.innerHTML = product.strategy.discount.value + "%";
          });
          discountedProductPriceValue = parseFloat(this.selectedVariant.node.price) - ((parseFloat(this.selectedVariant.node.price) / 100) * product.strategy.discount.value);
        }
        else {
          const currencyFormatter = this.createCurrencyFormatter(product.strategy.discount.type);
          discounts.forEach(discount => {
            const discountValue = product.strategy.discount.value || 0;
            const convertedDiscountValue = this.convertPriceToCurrentCurrencyCode(discountValue, product.strategy.discount.type);
            discount.innerHTML = currencyFormatter.format(convertedDiscountValue);
          });
          discountedProductPriceValue = parseFloat(this.selectedVariant.node.price) - parseFloat(product.strategy.discount.value);
        }
        discountedProductPrices.forEach(discountedProductPrice => {
          const currencyFormatter = this.createCurrencyFormatter();
          const convertedProductPrice = currencyFormatter.format(this.convertPriceToCurrentCurrencyCode(discountedProductPriceValue * quantity, product.strategy.discount.type));
          discountedProductPrice.innerHTML = convertedProductPrice;
        });
      }
    }

    updateProductPrice(product, quantity = 1) {
      const productPrices = this.getElements('.salestorm-product-price');
      const currencyFormatter = this.createCurrencyFormatter();
      productPrices.forEach(productPrice => {
        if (this.selectedVariant) {
          const selectedVariantPrice = this.selectedVariant.node.price || 0;
          const convertedPrice = this.convertPriceToCurrentCurrencyCode(selectedVariantPrice * quantity, product.strategy.storeCurrencyCode);
          productPrice.innerHTML = currencyFormatter.format(convertedPrice);
        }
      });
    }

    convertPriceToCurrentCurrencyCode(price, baseCurrencyCode) {
      const multiCurrencySupport = this.getAttribute("multicurrency") === "true";
      let convertedPriceValue = price;
      if (window.Currency && window.Currency.rates && window.Currency.convert && multiCurrencySupport && window.Salestorm && window.Salestorm.currentCurrencyCode) {
        convertedPriceValue = Math.round(window.Currency.convert(price, baseCurrencyCode, window.Salestorm.currentCurrencyCode));
      }
      return convertedPriceValue;
    }

    updatePrices(product, quantity = 1) {
      const multiCurrencySupport = this.getAttribute("multicurrency") === "true";
      window.Salestorm.currentCurrencyCode = (multiCurrencySupport && this.getDisplayedStoreCurrencyCode())|| product.strategy.storeCurrencyCode;
      this.updateDiscounts(product, quantity);
      this.updateProductPrice(product, quantity);
    }

    removeProductLink() {
      const productImageContainer = this.getElement('#salestorm-product-image-container');
      productImageContainer.removeAttribute('href');
      const titleProduct = this.getElement('#salestorm-product-title');
      titleProduct.removeAttribute('href');
    }

    updateProductLink(link) {
      const preview = this.getAttribute('preview');
      const titleProduct = this.getElement('#salestorm-product-title');
      const productImageContainer = this.getElement('#salestorm-product-image-container');
      if (preview) {
        titleProduct.setAttribute('href', '#');
        productImageContainer.setAttribute('href', '#');
      } else {
        titleProduct.setAttribute('href', link);
        productImageContainer.setAttribute('href', link);
      }
    }

    updateVariants(product) {
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
    }

    setImage(image) {
      this.image = image;
      this.getElement('#salestorm-product-image').style.backgroundImage = "url("+image+")";
    }

    updateProductImages(product) {
      const featuredImage = product.featuredImage && product.featuredImage.transformedSrc;
      const variantImages = product.variants.edges.map(variant => variant.node.image && variant.node.image.transformedSrc).filter(variant => variant !== null);
      if (variantImages.length > 0) {
        this.images = variantImages;
        this.getElement('#salestorm-product-image-slider').classList.remove('d-none');
      } else {
        this.images = [featuredImage];
        this.getElement('#salestorm-product-image-slider').classList.add('d-none');
      }
      this.setImage(this.images[0]);
    }

    updateProduct(product) {
      if (product) {
        this.updateVariants(product);
        this.getElement('#salestorm-product-title').innerHTML = product.title;
        this.updateProductImages(product);
        const productDetailsActionElement = this.getElement('#salestorm-campaign-text-seeProductDetailsAction');
        if (product.descriptionHtml === '') {
          if (productDetailsActionElement) {
            productDetailsActionElement.style.display = 'none';
          }
        } else {
          this.getElement('#salestorm-product-description').innerHTML = product.descriptionHtml;
          if (productDetailsActionElement) {
            productDetailsActionElement.style.display = 'block';
          }
        }
        this.setSelectedProductVariant(product);
        this.getElements('.salestorm-product-select').forEach(selectElement => {
          selectElement.addEventListener('change', () => {
            this.setSelectedProductVariant(product);
            this.updatePrices(product);
          });
        });
      }
      this.updatePrices(product);
    }

    updateTexts(texts) {
      const processCampaignTextsUtil = (text) => {
        let newText = text
          .replace(
            '{{Discount}}',
            '<span class="salestorm-price salestorm-discount"></span>'
          )
          .replace('{{Countdown}}', '<span id="salestorm-campaign-countdown"></span>')
          .replace(
            '{{ProductPrice}}',
            '<span class="salestorm-price salestorm-product-price"></span>'
          )
          .replace(
            '{{DiscountedProductPrice}}',
            '<span class="salestorm-price salestorm-product-price-discounted"></span>'
          )
          if(this.getAttribute('preview')) {
            newText = newText
              .replace('<a ', '<span ')
              .replace('</a>', '</span>');
          }
          return newText;
        }
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
          this.resetCountdown();
          this.resetProgressBars();
        }
      });
      const product = this.getAttribute('product');
      this.updatePrices(JSON.parse(product));
    }

    resetCountdown() {
      clearInterval(this.countdownIntervalId);
      const initialTime = this.getAttribute('countdowntime');
      this.startCountdown(initialTime, parseInt(this.getAttribute('offers')));
    }

    resetProgressBars() {
      const progressBars = this.getElements('.salestorm-progress-bar');
      for (let progressBar of progressBars) {
        progressBar.style.width = '0%';
      }
    }

    renderSkipOfferButton(offers) {
      const skipOfferButton = this.getElement('#salestorm-popup-skip');
      if (offers > 1) {
        skipOfferButton.classList.remove('d-none');
      } else {
        skipOfferButton.classList.add('d-none');
      }
    }

    renderProgressBars(offers) {
      const progressBarsContainer = this.getElement('#salestorm-progress-bar-container');
      const oldProgressBars = this.getElements('.salestorm-progress-bar-wrapper');
      if (oldProgressBars) {
        for (let oldProgressBar of oldProgressBars) {
          oldProgressBar.remove();
        }
      }
      for (let i = 0; i < offers; i++) {
        const progressBar = document.createElement('div');
        progressBar.classList.add('salestorm-progress-bar');
        const progressBarWrapper = document.createElement('div');
        progressBarWrapper.classList.add('salestorm-progress-bar-wrapper');
        progressBarWrapper.style.width = offers > 1 ? 98 / offers + "%" : "100%";
        progressBarWrapper.appendChild(progressBar);
        progressBarsContainer.appendChild(progressBarWrapper);
      }
    }

    startCountdown(initialTime, offers) {
      const timeElement = this.getElement('#salestorm-campaign-countdown');
      const time = initialTime ? initialTime.split(':') : [0,0];
      const minutes = parseInt(time[0]);
      const seconds = parseInt(time[1]);
      let totalSeconds = (minutes * 60 + seconds).toFixed(3);
      const prepend = (number) => number.toString().length == 1 ? "0"+number.toString() : number;
      let progress = 0;
      const onePercentage = (100 / totalSeconds);
      if (timeElement) {
        timeElement.innerText = initialTime;
        this.countdownIntervalId = setInterval(() => {
          const currentOffer = parseInt(this.getAttribute('currentoffer'));
          if (totalSeconds > 0) {
            totalSeconds--;
            progress = progress + onePercentage;
            const displayedProgressBars = Array.from(this.getElements('.salestorm-progress-bar'));
            if (displayedProgressBars[currentOffer]) {
              displayedProgressBars[currentOffer].style.width = progress + "%";
            }
            const currentMinutes = Math.floor(totalSeconds / 60);
            const currentSeconds = totalSeconds - currentMinutes * 60;
            timeElement.innerText = prepend(currentMinutes) + ":" + prepend(currentSeconds);
          } else {
            if (offers > 1) {
              if (currentOffer < (offers - 1)) {
                window.Salestorm.skipOffer(this);
                this.resetCountdown();
                if ((currentOffer + 2) === offers) {
                  const skipOfferButton = this.getElement('#salestorm-popup-skip');
                  skipOfferButton.classList.add('d-none');
                }
              } else {
                this.resetProgressBars();
                this.resetCountdown();
                document.dispatchEvent(window.Salestorm.hidePopup);
              }
            } else {
              this.resetProgressBars();
              this.resetCountdown();
              document.dispatchEvent(window.Salestorm.hidePopup);
            }
          }
        }, 1000);
        return this.countdownIntervalId;
      } else {
        clearInterval(this.countdownIntervalId);
      }
    }

    updateAnimation(animation) {
      this.getElement('#salestorm-popup').className = animation;
    }

  }
  if (!window.customElements.get('salestorm-popup')) {
    window.customElements.define('salestorm-popup', SalestormPopupComponent);
  }
`;

export default customElement;
