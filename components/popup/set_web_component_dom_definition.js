const setWebComponentDomDefinitionPopup = (templateID) => `
  class SalestormPopupComponent extends HTMLElement {
    shadow;

    constructor() {
      super();

      this.setupShadow();
    }

    connectedCallback() {
      this.setupClickListener();
    }

    disconnectedCallback() {
      // remove events
    }

    adoptedCallback() {}

    attributeChangedCallback(_name, _oldValue, _newValue) {}

    setupShadow() {
      this.shadow = this.attachShadow({ mode: 'open' });
      const template = document.getElementById("${templateID}");
      const templateContent = template.content;
      this.shadow.appendChild(templateContent.cloneNode(true));
    }

    addCssDynamic() {}

    setupClickListener() {
      const closeButton = document.querySelector('#salestorm-popup-close');
      console.log(closeButton)
      closeButton && closeButton.addEventListener('click', () => {
        this.hidePopup();
      });
      this.hidePopup();
    }

    hidePopup() {
      console.log('hey')
      //document.querySelector('#salestorm-overlay-container').style.display = 'none';
    }
  }
  if (!customElements.get('salestorm-popup')) {
    customElements.define('salestorm-popup', SalestormPopupComponent);
  }
`;

export default setWebComponentDomDefinitionPopup
