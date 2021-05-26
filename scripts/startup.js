import * as Sentry from '@sentry/browser';

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
  // eslint-disable-next-line no-undef
  const publicAPI = `${process.env.HOST}/api`;
  const shop = window.Shopify.shop || window.location.host;
  const productPageRegex = /\/products\/[^?/#]+/;
  const thankYouPageRegex = /\/thank_you/;
  const cartPageRegex = /\/cart/;

  const getCart = async () => {
    const response = await fetch('/cart.js');
    const cart = await response.json();
    return cart;
  };

  const getCurrentProduct = async () => {
    let product;
    const productPageMatch = window.location.pathname.match(productPageRegex);
    if (!productPageMatch) return null;
    // Many shopify themes have this meta global which includes the product ID
    if (typeof meta !== 'undefined' && window.meta.product) {
      product = window.meta.product;
    } else {
      const response = await fetch(`${productPageMatch[0]}.js`);
      product = await response.json();
    }

    return product;
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
    campaignId,
    productPageProductId
  ) => {
    const cart = await getCart();
    if (cart) {
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
          campaignId,
          productPageProductId,
        }),
      });
      response = await response.json();
      if (response.invoiceUrl) {
        window.location.href = response.invoiceUrl;
      }
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
    } while (!formElement && eventTarget.tagName !== 'BODY');
    return formElement;
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
        if (targetPage === targets.addToCart) {
          const currentProduct = await getCurrentProduct();
          const productPageProductId = currentProduct.id;

          const buttonInForm = document.querySelector(addToCartButtonSelector);
          const form = searchFormFromTarget(buttonInForm);

          if (campaign.entry === 'onclick' && Boolean(form)) {
            const body = new URLSearchParams(new FormData(form));
            await fetch('/cart/add', {
              method: 'post',
              redirect: 'manual',
              body,
            });
            createDraftOrder(
              variantId,
              strategy,
              quantity,
              campaign.id,
              productPageProductId
            );
          } else {
            document.dispatchEvent(continueOriginalClickEvent);
            if (productsAddedByXHROrFetch) {
              createDraftOrder(
                variantId,
                strategy,
                quantity,
                campaign.id,
                productPageProductId
              );
            }
          }
        } else {
          await createDraftOrder(
            variantId,
            strategy,
            quantity,
            campaign.id,
            null
          );
        }
      };
    }
  };

  const addEarlyClickListener = (selector, callback, options = {}) => {
    const targetElement = document.querySelector(selector);
    if (targetElement) {
      document.addEventListener(
        'click',
        (event) => {
          if (targetElement.contains(event.target)) {
            callback(event);
          }
        },
        options
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
      if (campaign.targets.entry === 'onclick') {
        const eventHandler = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const clonedEvent = new MouseEvent('click', e);
          showPopup(targets.checkout);
          document.addEventListener(continueOriginalClickEvent.type, () => {
            e.target.dispatchEvent(clonedEvent);
          });
        };
        addEarlyClickListener(checkoutButtonSelector, eventHandler, {
          once: true,
        });
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

  const handleProductPage = async () => {
    const currentProduct = await getCurrentProduct();
    const recommendations = await getRecommendations(currentProduct.id);
    const cart = await getCart();
    const totalPrice = cart.total_price / 100;
    popups[targets.addToCart] = await fetchCampaign(
      targets.addToCart,
      [currentProduct.id],
      totalPrice,
      recommendations
    );
    const { campaign } = popups[targets.addToCart];
    if (campaign && campaign.targets.entry === 'onclick') {
      const interruptEvents = campaign.options.interruptEvents;
      if (interruptEvents) {
        addEarlyClickListener(addToCartButtonSelector, (event) => {
          if (!popups[targets.addToCart].displayed) {
            showPopup(targets.addToCart);
            event.preventDefault();
            event.stopPropagation();
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
    if (!campaign) {
      return;
    }
    if (campaign.targets.entry === 'onclick') {
      addEarlyClickListener(continueShoppingSelector, (event) => {
        showPopup(targets.thankYou);
        event.preventDefault();
        event.stopPropagation();
        document.addEventListener(continueOriginalClickEvent.type, () => {
          const continueShoppingButton = document.querySelector(
            continueShoppingSelector
          );
          const shop =
            continueShoppingButton && continueShoppingButton.tagName === 'A'
              ? continueShoppingButton.href
              : `https://${shop}`;
          window.location.replace(shop);
        });
        return true;
      });
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
    Sentry.init({
      // eslint-disable-next-line no-undef
      dsn: process.env.SENTRY_DSN_FRONTEND,
      integrations(integrations) {
        // Remove the global exception handler so we only get embedded errors
        return integrations.filter(
          (integration) => integration.name !== 'GlobalHandlers'
        );
      },
      tracesSampleRate: 1.0,
    });
    try {
      initShopifyMultiCurrencyConversionScript();
      // These 2 monkey patches are needed so we can detect products being added on the add to cart form
      // The issue is that if that add to cart is really a form, we don't have a way to tell if any other
      // JS is already adding the product to the cart, so we have to monitor XHR and fetch requests.
      initXHRMonkeyPatch();
      initFetchMonkeyPatch();
      const path = window.location.pathname;
      const productPage = path.match(productPageRegex);
      const thankYouPage = path.match(thankYouPageRegex);
      const cartPage = path.match(cartPageRegex);
      const handleCartDrawers = setInterval(() => {
        if (!document.querySelector(checkoutButtonSelector)) {
          return;
        }
        handleCart();
        clearInterval(handleCartDrawers);
      }, 1000);
      if (productPage) {
        handleProductPage();
      } else if (thankYouPage) {
        handleThankYouPage();
      } else if (cartPage) {
        handleCart();
      }
      window.SalestormInitialized = true;
    } catch (err) {
      Sentry.captureException(err);
    }
  };
  if (!window.SalestormInitialized) {
    init();
  }
})();
