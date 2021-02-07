(function () {
  const triggers = {
    addToCart: 'add_to_cart',
    checkout: 'checkout',
    thankYou: 'thank_you',
  };
  const popups = {
    [triggers.addToCart]: null,
    [triggers.checkout]: null,
    [triggers.thankYou]: null,
  };
  const addToCartButtonSelector = [
    '[name=addToCart]',
    '#btn-add-to-cart',
    '.AddtoCart',
    'a[href^="/cart/add"]',
    '#addToCartBtn',
    '.addToCart',
    '.btn-addtocart',
    '#add-to-cart-btn',
    '#shopify_add_to_cart',
    '#add-to-cart',
    '#addToCartButton',
    '.btn_add_to_cart',
    '.add_to_cart_button',
    '.add-to-cart',
    '[data-action="add-to-cart"]',
    '.btn-add-to-cart',
    '[name=AddToCart]',
    '.button-add-to-cart',
    '#btnAddToCart',
    '#AddToCart',
    '[data-action="AddToCart"]',
    '.button_add_to_cart',
    '.add-to-cart-button',
    '.addtocart',
    '.AddToCart',
    '.add_to_cart_btn',
    '.add_to_cart',
    '.add-to-cart-btn',
    '[name=add]',
  ];
  const checkoutButtonSelector = ['[name="checkout"]', 'a[href^="/checkout"]'];
  const continueOriginalClickEvent = new Event(
    'salestorm-continue-original-click-event'
  );
  let productsAddedByXHROrFetch = false;

  const fetchCampaign = async (trigger, products) => {
    try {
      const response = await fetch(
        'https://loop.salestorm.cc:8081/api/get-matching-campaign',
        {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shop: window.Shopify.shop,
            trigger,
            products,
          }),
        }
      );
      if (response.ok) {
        const campaign = await response.text();
        popups[trigger] = campaign;
      } else {
        popups[trigger] = null;
      }
      return Boolean(popups[trigger]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(window.Shopify);
      throw error;
    }
  };

  const showPopup = (trigger) => {
    const oldPopup = document.getElementsByTagName('salestorm-popup');
    if (oldPopup && oldPopup[0]) oldPopup[0].remove();
    document.body.insertAdjacentHTML('beforeend', popups[trigger]);
    const newPopup = document.getElementsByTagName('salestorm-popup');
    if (newPopup && newPopup[0]) {
      newPopup[0].setAttribute('visible', 'true');
    }
    if (window.Salestorm.hidePopup) {
      document.addEventListener(window.Salestorm.hidePopup.type, () =>
        document.dispatchEvent(continueOriginalClickEvent)
      );
    }
  };

  const searchFormFromTarget = (initialTarget) => {
    let formElement;
    let target = initialTarget;
    while (target) {
      if (target.tagName && target.tagName.toUpperCase() === 'FORM') {
        formElement = target;
        break;
      }
      target = target.parentNode;
    }
    return formElement;
  };

  const addEarlyClickListener = (selector, callback, capture = true) => {
    const targetElement = document.querySelector(selector);
    if (targetElement) {
      document.addEventListener(
        'click',
        (event) => {
          if (targetElement.contains(event.target)) {
            callback(event);
          }
        },
        capture
      );
      return true;
    }
    return false;
  };

  const handleProductPage = async (productPage) => {
    let productId;
    // Many shopify themes have this meta global which includes the product ID
    if (typeof meta !== 'undefined' && window.meta.product) {
      productId = window.meta.product.id;
    } else {
      const response = await fetch(`${productPage[0]}.js`);
      const product = await response.json();
      productId = product.id;
    }
    const hasCampaign = await fetchCampaign(triggers.addToCart, [productId]);
    if (hasCampaign) {
      let displayedCampaign = false;
      addEarlyClickListener(addToCartButtonSelector, (event) => {
        if (!displayedCampaign) {
          showPopup(triggers.addToCart);
          event.preventDefault();
          event.stopPropagation();
          const handleCartDrawers = setInterval(() => {
            if (document.querySelector(checkoutButtonSelector)) {
              handleCart();
              clearInterval(handleCartDrawers);
            }
          }, 500);
          document.addEventListener(continueOriginalClickEvent.type, () => {
            displayedCampaign = true;
            if (!productsAddedByXHROrFetch) {
              event.target.click();
            }
          });
        }
        return true;
      });
    }
  };

  const getCartItems = async () => {
    const response = await fetch('/cart.js');
    const cart = await response.json();
    return cart.items;
  };

  const handleCart = async () => {
    let hasCampaign;
    const checkAndHandleCartCampaign = async () => {
      const currentItemsInCart = await getCartItems();
      hasCampaign = await fetchCampaign(
        triggers.checkout,
        currentItemsInCart.map((item) => item.product_id)
      );
      if (hasCampaign) {
        let displayedCampaign = false;
        addEarlyClickListener(checkoutButtonSelector, (event) => {
          if (!displayedCampaign) {
            showPopup(triggers.checkout);
            event.preventDefault();
            event.stopPropagation();
            document.addEventListener(continueOriginalClickEvent.type, () => {
              displayedCampaign = true;
              const checkoutForm = searchFormFromTarget(event.target);
              if (checkoutForm) {
                checkoutForm.requestSubmit();
              }
              event.target.click();
            });
          }
          return true;
        });
      }
    };
    await checkAndHandleCartCampaign();
    const checkAndHandleCartCampaignInterval = setInterval(async () => {
      if (hasCampaign) {
        clearInterval(checkAndHandleCartCampaignInterval);
      } else {
        await checkAndHandleCartCampaign();
      }
    }, 3000);
  };

  const handleThankYouPage = async () => {
    const hasCampaign = await fetchCampaign(
      triggers.thankYou,
      window.Shopify.checkout.line_items.map((item) => item.product_id)
    );
    if (hasCampaign) showPopup(triggers.thankYou);
  };

  const checkForProductAdd = (url) => {
    if (url && url.match(/cart\/add/)) {
      productsAddedByXHROrFetch = true;
    }
  };

  const initXHRMonkeyPatch = () => {
    const oldOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (
      method,
      url,
      async,
      user,
      password
    ) {
      checkForProductAdd(url);
      return oldOpen.apply(this, [method, url, async, user, password]);
    };
  };

  const initFetchMonkeyPatch = () => {
    const oldFetch = window.fetch;
    window.fetch = (url, options) => {
      checkForProductAdd(url);
      return oldFetch(url, options);
    };
  };

  const initShopifyMultiCurrencyConversionScript = () => {
    if (
      !(window.Currency && window.Currency.rates && window.Currency.convert)
    ) {
      const script = document.createElement('script');
      script.src = 'https://cdn.shopify.com/s/javascripts/currencies.js';
      document.head.appendChild(script);
    }
  };

  const init = () => {
    initShopifyMultiCurrencyConversionScript();
    // These 2 monkey patches are needed so we can detect products being added on the add to cart form
    // The issue is that if that add to cart is really a form, we don't have a way to tell if any other
    // JS is already adding the product to the cart, so we have to monitor XHR and fetch requests.
    initXHRMonkeyPatch();
    initFetchMonkeyPatch();
    const path = window.location.pathname;
    const productPage = path.match(/\/products\/[^?/#]+/);
    const thankYouPage = path.match(/\/thank_you/);
    if (productPage) {
      handleProductPage(productPage);
    } else if (thankYouPage) {
      handleThankYouPage();
    } else {
      handleCart();
    }
  };

  init();
})();
