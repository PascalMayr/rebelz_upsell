const defineCustomElementPopup = (popupID) => `
  class SalestormPopupComponent extends HTMLElement {
    shadow;

    constructor() {
      super();
      this.setupShadow();
    }

    static get observedAttributes() {
      return ['visible', 'product'];
    }

    connectedCallback() {
      window.Salestorm = {
        popupId: "${popupID}",
        hidePopup: new Event('salestorm-hide-popup-event')
      };
      this.setupClickListeners();
      this.setupKeyListeners();
      this.setupHidePopupListener();
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
      if (name === 'product') {
        this.updateProduct(JSON.parse(newValue));
      }
    }

    setupShadow() {
      this.shadow = this.attachShadow({ mode: 'open' });
      this.shadow.innerHTML = this.innerHTML;
    }

    setupClickListeners() {
      const productDetailsMessage = this.shadow.querySelector('#salestorm-campaign-text-seeProductDetailsAction');
      const descriptionElement = this.shadow.querySelector('#salestorm-product-description');
      if (descriptionElement && productDetailsMessage) {
        descriptionElement.style.display = 'none';
        productDetailsMessage.addEventListener('click', () => {
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

    setupHidePopupListener() {
      document.addEventListener(window.Salestorm.hidePopup.type, () => {
        this.shadow.querySelector('#salestorm-overlay-container').style.display = 'none';
      })
    }

    hidePopup() {
      document.dispatchEvent(window.Salestorm.hidePopup);
    }

    setSelectedProductVariant(product) {
      const sortStringArrayAlphabetically = array => array.sort((a, b) => a.length - b.length);
      const currentSelectionState = Array.from(this.shadow.querySelectorAll('.salestorm-product-select')).map(selectElement => selectElement.value);
      const selectedVariant = product.variants.edges.find(variant => {
        const variantOptionValues = variant.node.selectedOptions.map(selectedOption => selectedOption.value);
        return JSON.stringify(sortStringArrayAlphabetically(variantOptionValues)) === JSON.stringify(sortStringArrayAlphabetically(currentSelectionState));
      });

      const claimOfferButton = this.shadow.querySelector('#salestorm-campaign-text-addToCartAction');
      if (selectedVariant) {
        if (selectedVariant.node && selectedVariant.node.image) {
          this.shadow.querySelector('#salestorm-product-image').style.backgroundImage = "url("+selectedVariant.node.image.transformedSrc+")";
        }
      }
    }

    updateProduct(product) {
      const elementUpdateSelectors = ['#salestorm-product-title', '#salestorm-product-variants', '#salestorm-product-description'];
      for (let elementUpdateSelector of elementUpdateSelectors) {
        const updatedNode = document.querySelector(elementUpdateSelector);
        const oldNode = this.shadow.querySelector(elementUpdateSelector);
        if (updatedNode && oldNode) {
          oldNode.replaceWith(updatedNode);
        }
      }

      if (product) {
        const mainProductImage = product.images.edges.length > 0 && product.images.edges[0].node.transformedSrc;
        if (mainProductImage) {
          this.shadow.querySelector('#salestorm-product-image').style.backgroundImage = "url("+mainProductImage+")";
        }
        this.setSelectedProductVariant(product);
        this.shadow.querySelectorAll('.salestorm-product-select').forEach(selectElement => {
          selectElement.addEventListener('change', () => {
            const selectedValue = selectElement.value;
            this.setSelectedProductVariant(product);
          })
        });
      }

    }

  }
  if (!customElements.get('salestorm-popup')) {
    customElements.define('salestorm-popup', SalestormPopupComponent);
  }
`;

export default defineCustomElementPopup;
