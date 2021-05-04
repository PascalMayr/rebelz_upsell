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
  const continueShoppingSelector = ['.step__footer__continue-btn'];
  const continueOriginalClickEvent = new Event(
    'salestorm-continue-original-click-event'
  );
  let productsAddedByXHROrFetch = false;
  const publicAPI = `${process.env.HOST}/api`;
  const shop = window.Shopify.shop || window.location.host;

  const getCart = async () => {
    const response = await fetch('/cart.js');
    const cart = await response.json();
    return cart;
  };

  const countView = async (targetPage) => {
    const { campaign } = popups[targetPage];
    await fetch(`${publicAPI}/count-view`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: campaign.id,
        shop,
        target: targetPage,
      }),
    });
  };

  const fetchCampaign = async (
    targetPage,
    products,
    totalPrice,
    recommendations
  ) => {
    const response = await fetch(`${publicAPI}/get-matching-campaign`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shop,
        target: targetPage,
        products,
        totalPrice,
        recommendations,
      }),
    });
    if (response.ok) {
      const campaign = await response.json();
      // eslint-disable-next-line no-eval
      eval(campaign.js);
      return { ...campaign, displayed: false };
    } else {
      return targetPage;
    }
  };

  const createDraftOrder = async (
    variantId,
    strategy,
    quantity,
    cart,
    id,
    products
  ) => {
    let response = await fetch(`${publicAPI}/create-draft-order`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variantId,
        strategy,
        quantity,
        cart,
        shop,
        id,
        products,
      }),
    });
    response = await response.json();
    if (response.invoiceUrl) {
      window.location.href = response.invoiceUrl;
    }
  };

  const showPopup = async (targetPage) => {
    const { campaign } = popups[targetPage];
    if (popups[targetPage].displayed || !campaign) {
      return;
    }
    document.body.insertAdjacentHTML('beforeend', popups[targetPage].html);
    const popup = document.querySelector(`#salestorm-campaign-${campaign.id}`);
    if (popup) {
      popup.setAttribute('visible', 'true');
      popups[targetPage].displayed = true;
      await countView(targetPage);
    }
    if (window.Salestorm) {
      document.addEventListener(window.Salestorm.hidePopup.type, () => {
        const popupElement = document.querySelector(
          `#salestorm-campaign-${campaign.id}`
        );
        popupElement.setAttribute('visible', 'false');
        document.dispatchEvent(continueOriginalClickEvent);
      });
      window.Salestorm.skipOffer = (popupElement) => {
        let currentOffer = parseInt(
          popupElement.getAttribute('currentoffer'),
          10
        );
        currentOffer += 1;
        const newProduct = campaign.selling.products[currentOffer];
        if (newProduct) {
          popupElement.setAttribute('currentoffer', currentOffer);
          popupElement.setAttribute('product', JSON.stringify(newProduct));
        }
      };
      window.Salestorm.claimOffer = async (variantId, strategy, quantity) => {
        document.dispatchEvent(continueOriginalClickEvent);
        const cart = await getCart();
        if (cart) {
          if (
            campaign.options.interruptEvents &&
            campaign.entry === 'onclick'
          ) {
            const cartInterval = setInterval(async () => {
              const currentCart = await getCart();
              if (
                currentCart &&
                currentCart.items &&
                currentCart.items.length > 0
              ) {
                clearInterval(cartInterval);
                createDraftOrder(
                  variantId,
                  strategy,
                  quantity,
                  currentCart,
                  campaign.id,
                  campaign.products
                );
              }
            }, 2000);
          } else {
            createDraftOrder(
              variantId,
              strategy,
              quantity,
              cart,
              campaign.id,
              campaign.products
            );
          }
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

  const addExitIntentListener = (targetPage) => {
    if (window.matchMedia('(pointer:fine)').matches) {
      let cursorStartsFromBottom;
      document.addEventListener('mousemove', (event) => {
        if (event.pageY) {
          if (event.pageY < 150 && cursorStartsFromBottom) {
            showPopup(targetPage);
          } else {
            cursorStartsFromBottom = event.pageY > 150;
          }
        }
      });
    } else {
      history.pushState(null, document.title, window.location.href);
      window.addEventListener(
        'popstate',
        () => {
          showPopup(targetPage);
        },
        { once: true }
      );
      document.addEventListener('visibilitychange', () => {
        showPopup(targetPage);
      });
    }
  };

  const getRecommendations = async (productId) => {
    let recommendation = await fetch(
      `/recommendations/products.json?product_id=${productId}`
    );
    recommendation = await recommendation.json();
    return recommendation.products.map((product) => ({
      id: product.id,
      price: product.price,
    }));
  };

  const handleCart = async () => {
    const checkAndHandleCartCampaign = async () => {
      const cart = await getCart();
      const currentItemsInCart = cart.items;
      const totalPrice = cart.total_price / 100;
      let recommendations = [];
      await Promise.all(
        currentItemsInCart.map(async (cartItem) => {
          const newRecommendations = await getRecommendations(
            cartItem.product_id
          );
          recommendations = recommendations.concat(newRecommendations);
        })
      );
      popups[targets.checkout] = await fetchCampaign(
        targets.checkout,
        currentItemsInCart.map((item) => item.product_id),
        totalPrice,
        recommendations
      );
      const { campaign } = popups[targets.checkout];
      if (campaign.entry === 'onclick') {
        const interruptEvents = campaign.options.interruptEvents;
        if (interruptEvents) {
          addEarlyClickListener(checkoutButtonSelector, (event) => {
            if (!popups[targets.checkout].displayed) {
              showPopup(targets.checkout);
              event.preventDefault();
              event.stopPropagation();
              document.addEventListener(continueOriginalClickEvent.type, () => {
                event.target.click();
              });
            }
            return true;
          });
        } else {
          const checkoutButton = document.querySelector(checkoutButtonSelector);
          checkoutButton.addEventListener('click', () => {
            if (popups[targets.checkout].displayed) {
              return;
            }
            showPopup(targets.checkout);
            document.addEventListener(continueOriginalClickEvent.type, () => {
              const checkoutForm = searchFormFromTarget(event.target);
              if (checkoutForm) {
                checkoutForm.requestSubmit();
              }
            });
          });
        }
      } else {
        addExitIntentListener(targets.checkout);
      }
    };
    await checkAndHandleCartCampaign();
    const checkAndHandleCartCampaignInterval = setInterval(async () => {
      if (popups[targets.checkout].campaign) {
        clearInterval(checkAndHandleCartCampaignInterval);
      } else {
        await checkAndHandleCartCampaign();
      }
    }, 3000);
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
    const recommendations = await getRecommendations(productId);
    const cart = await getCart();
    const totalPrice = cart.total_price / 100;
    popups[targets.addToCart] = await fetchCampaign(
      targets.addToCart,
      [productId],
      totalPrice,
      recommendations
    );
    const { campaign } = popups[targets.addToCart];
    if (campaign && campaign.entry === 'onclick') {
      const interruptEvents = campaign.options.interruptEvents;
      if (interruptEvents) {
        addEarlyClickListener(addToCartButtonSelector, (event) => {
          if (!popups[targets.addToCart].displayed) {
            showPopup(targets.addToCart);
            event.preventDefault();
            event.stopPropagation();
            const handleCartDrawers = setInterval(() => {
              if (!document.querySelector(checkoutButtonSelector)) {
                return;
              }
              handleCart();
              clearInterval(handleCartDrawers);
            }, 500);
            document.addEventListener(continueOriginalClickEvent.type, () => {
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
            showPopup(targets.addToCart);
          });
        }
      }
    } else {
      addExitIntentListener(targets.addToCart);
    }
  };

  const handleThankYouPage = async () => {
    const lineItemProductIds = window.Shopify.checkout.line_items.map(
      (item) => item.product_id
    );
    let recommendations = [];
    await Promise.all(
      lineItemProductIds.map(async (itemProductId) => {
        const newRecommendations = await getRecommendations(itemProductId);
        recommendations = recommendations.concat(newRecommendations);
      })
    );
    popups[targets.thankYou] = await fetchCampaign(
      targets.thankYou,
      lineItemProductIds,
      window.Shopify.checkout.total_price,
      recommendations
    );
    const { campaign } = popups[targets.thankYou];
    if (campaign && campaign.entry === 'onclick') {
      const interruptEvents = campaign.options.interruptEvents;
      if (interruptEvents) {
        addEarlyClickListener(continueShoppingSelector, (event) => {
          if (!popups[targets.thankYou].displayed) {
            showPopup(targets.thankYou);
            event.preventDefault();
            event.stopPropagation();
            document.addEventListener(continueOriginalClickEvent.type, () => {
              event.target.click();
            });
          }
          return true;
        });
      } else {
        document
          .querySelector(continueShoppingSelector)
          .addEventListener('click', () => {
            if (popups[targets.thankYou].displayed) {
              return;
            }
            showPopup(targets.thankYou);
            document.addEventListener(continueOriginalClickEvent.type, () => {
              const continueShoppingButton = document.querySelector(
                continueShoppingSelector
              );
              if (continueShoppingButton) {
                continueShoppingButton.click();
              }
            });
          });
      }
    } else {
      addExitIntentListener(targets.thankYou);
    }
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
    if (window.Currency && window.Currency.rates && window.Currency.convert) {
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.shopify.com/s/javascripts/currencies.js';
    document.head.appendChild(script);
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
    const cartPage = path.match(/\/cart/);
    if (productPage) {
      handleProductPage(productPage);
    } else if (thankYouPage) {
      handleThankYouPage();
    } else if (cartPage) {
      handleCart();
    }
    window.SalestormInitialized = true;
  };
  if (!window.SalestormInitialized) {
    init();
  }
})();
