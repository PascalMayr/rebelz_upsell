(function () {
  const target = {};
  const targets = {
    addToCart: 'add_to_cart',
    checkout: 'checkout',
    thankYou: 'thank_you',
  };
  const popups = {
    [targets.addToCart]: target,
    [targets.checkout]: target,
    [targets.thankYou]: target,
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

  const getCart = async () => {
    const response = await fetch('/cart.js');
    const cart = await response.json();
    return cart;
  };

  const fetchCampaign = async (targetPage, products, totalPrice) => {
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
            target: targetPage,
            products,
            totalPrice,
          }),
        }
      );
      if (response.ok) {
        const campaign = await response.json();
        eval(campaign.js);
        return campaign;
      } else {
        return targetPage;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(window.Shopify);
      throw error;
    }
  };

  const showPopup = (targetPage) => {
    const { campaign } = popups[targetPage];
    const popup = document.querySelector(`#salestorm-campaign-${campaign.id}`);
    document.body.insertAdjacentHTML('beforeend', popups[targetPage].html);
    if (popup) {
      popup.setAttribute('visible', 'true');
    }
    if (window.Salestorm) {
      document.addEventListener(window.Salestorm.hidePopup.type, () => {
        document.dispatchEvent(continueOriginalClickEvent);
      });
      window.Salestorm.skipOffer = (popup) => {
        let currentOffer = parseInt(popup.getAttribute('currentoffer'), 10);
        currentOffer += 1;
        const newProduct = campaign.selling.products[currentOffer];
        if (newProduct) {
          popup.setAttribute('currentoffer', currentOffer);
          popup.setAttribute('product', JSON.stringify(newProduct));
        }
      };
    }
  };

  const searchFormFromTarget = (initialTarget) => {
    let formElement;
    let eventTarget = initialTarget;
    do {
      if (eventTarget.tagName && eventTarget.tagName.toUpperCase() === 'FORM') {
        formElement = eventTarget;
      }
      eventTarget = eventTarget.parentNode;
    } while (!formElement);
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
    const cart = await getCart();
    const totalPrice = cart.total_price / 100;
    popups[targets.addToCart] = await fetchCampaign(
      targets.addToCart,
      [productId],
      totalPrice
    );
    if (popups[targets.addToCart].campaign) {
      let displayedCampaign = false;
      const interruptEvents =
      popups[targets.addToCart].campaign.options.interruptEvents;
      if (interruptEvents) {
        addEarlyClickListener(addToCartButtonSelector, (event) => {
          if (!displayedCampaign) {
            showPopup(targets.addToCart);
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
      } else {
        const addToCartButton = document.querySelector(addToCartButtonSelector);
        if (addToCartButton) {
          addToCartButton.addEventListener('click', () => {
            displayedCampaign = true;
            showPopup(targets.addToCart);
          });
        }
      }
    }
  };

  const handleCart = async () => {
    let hasCampaign;
    const checkAndHandleCartCampaign = async () => {
      const cart = await getCart();
      const currentItemsInCart = cart.items;
      const totalPrice = cart.total_price / 100;
      popups[targets.checkout] = await fetchCampaign(
        targets.checkout,
        currentItemsInCart.map((item) => item.product_id),
        totalPrice
      );
      if (popups[targets.checkout].campaign) {
        let displayedCampaign = false;
        const interruptEvents =
          popups[targets.checkout].campaign.options.interruptEvents;
        if (interruptEvents) {
          addEarlyClickListener(checkoutButtonSelector, (event) => {
            if (!displayedCampaign) {
              showPopup(targets.checkout);
              event.preventDefault();
              event.stopPropagation();
              document.addEventListener(continueOriginalClickEvent.type, () => {
                displayedCampaign = true;
                event.target.click();
              });
            }
            return true;
          });
        } else {
          const checkoutButton = document.querySelector(checkoutButtonSelector);
          checkoutButton.addEventListener('click', () => {
            if (!displayedCampaign) {
              showPopup(targets.checkout);
              displayedCampaign = true;
              document.addEventListener(continueOriginalClickEvent.type, () => {
                const checkoutForm = searchFormFromTarget(event.target);
                if (checkoutForm) {
                  checkoutForm.requestSubmit();
                }
              });
            }
          });
        }
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
    popups[targets.thankYou] = await fetchCampaign(
      targets.thankYou,
      window.Shopify.checkout.line_items.map((item) => item.product_id),
      window.Shopify.checkout.total_price
    );
    if (popups[targets.thankYou].campaign) showPopup(targets.thankYou);
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
    window.SalestormInitialized = true;
  };
  if (!window.SalestormInitialized) {
    init();
  }
})();
