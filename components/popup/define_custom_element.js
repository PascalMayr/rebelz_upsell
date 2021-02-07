const defineCustomElementPopup = (popupID) => `
  class SalestormPopupComponent extends HTMLElement {
    shadow;

    constructor() {
      super();
      this.setupShadow();
    }

    static get observedAttributes() {
      return ['visible'];
    }

    connectedCallback() {
      window.Salestorm = {
        popupId: "${popupID}",
        hidePopup: new Event('salestorm-hide-popup-event'),
        hideProductDetails: new Event('salestorm-hide-product-details'),
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

    setupHidePopupListener() {
      document.addEventListener(window.Salestorm.hidePopup.type, () => {
        this.shadow.querySelector('#salestorm-overlay-container').style.display = 'none';
      })
    }

    hidePopup() {
      document.dispatchEvent(window.Salestorm.hidePopup);
    }

  }
  if (!customElements.get('salestorm-popup')) {
    customElements.define('salestorm-popup', SalestormPopupComponent);
  }
`;

export default defineCustomElementPopup;
