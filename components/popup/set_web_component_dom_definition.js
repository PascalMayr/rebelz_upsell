const setWebComponentDomDefinitionPopup = (templateID) => `
  class SalestormPopupComponent extends HTMLElement {
    shadow;

    constructor() {
      super();

      this.setupShadow();
    }

    connectedCallback() {
      window.Salestorm = {
        popupId: "${templateID}",
        hidePopup: new Event('salestorm-hide-popup-event'),
      };
      this.setupClickListeners();
      this.setupKeyListeners();
    }

    disconnectedCallback() {
      // remove events
    }

    adoptedCallback() {}

    attributeChangedCallback(_name, _oldValue, _newValue) {}

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
  }
  if (!customElements.get('salestorm-popup')) {
    customElements.define('salestorm-popup', SalestormPopupComponent);
  }
`;

export default setWebComponentDomDefinitionPopup
