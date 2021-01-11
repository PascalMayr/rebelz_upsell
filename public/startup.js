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
  const popupId = 'salestorm';
  const productAddEvent = new Event('salestorm-product-add');

  const fetchCampaign = async (trigger, products) => {
    try {
      const response = await fetch(
        'https://020eba19ad4c.ngrok.io/api/get-matching-campaign',
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
        const campaign = await response.json();
        popups[trigger] = campaign.html;
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
    document.body.insertAdjacentHTML('beforeend', popups[trigger]);
    document.getElementById(popupId).style.display = 'block';
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
      // Listening to the click event on the document in the capture phase
      // This is so that hopefully it gets executed before any other click listener
      document.addEventListener(
        'click',
        (e) => {
          let target = e.target;
          if (!target.matches(addToCartButtonSelector)) return;

          showPopup(triggers.addToCart);

          let addToCartForm;
          while (target) {
            if (target.tagName && target.tagName.toUpperCase() === 'FORM') {
              addToCartForm = target;
              break;
            }
            target = target.parentNode;
          }
          if (addToCartForm) {
            addToCartForm.addEventListener('submit', (ev) =>
              ev.preventDefault()
            );
            const timeout = setTimeout(() => {
              fetch(addToCartForm.action, {
                method: addToCartForm.method || 'GET',
                body: new FormData(addToCartForm),
              });
            }, 1500);
            document.addEventListener(productAddEvent.type, () => {
              clearTimeout(timeout);
            });
          }
          return true;
        },
        true
      );
    }
  };

  const contiouslyFetchCartAndUpdateCampaign = () => {
    let previousItems;
    let hasClickListener = false;
    return setInterval(async () => {
      if (document.visibilityState !== 'visible') return;

      const response = await fetch('/cart.js');
      const cart = await response.json();
      const currentItems = cart.items;
      if (
        !previousItems ||
        JSON.stringify(currentItems) !== JSON.stringify(previousItems)
      ) {
        previousItems = currentItems;
        const hasCampaign = await fetchCampaign(
          triggers.checkout,
          currentItems.map((item) => item.product_id)
        );
        if (hasCampaign && !hasClickListener) {
          document.querySelector(checkoutButtonSelector).addEventListener(
            'click',
            (e) => {
              e.preventDefault();
              showPopup(triggers.checkout);
            },
            true
          );
          hasClickListener = true;
        }
      }
    }, 3000);
  };

  const handleCart = () => {
    // The current checkout button, which might appear and disappear at any point
    let currentCheckoutButton;
    let cartFetchInterval;
    // Check for a cart drawer or popup to appear
    setInterval(function () {
      const newCheckoutButton = document.querySelector(checkoutButtonSelector);
      if (newCheckoutButton !== currentCheckoutButton) {
        currentCheckoutButton = newCheckoutButton;
        if (cartFetchInterval) {
          clearInterval(cartFetchInterval);
          cartFetchInterval = null;
        }
        cartFetchInterval = contiouslyFetchCartAndUpdateCampaign();
      }
    }, 300);
  };

  const handleThankYouPage = async () => {
    const hasCampaign = await fetchCampaign(
      triggers.thankYou,
      window.Shopify.checkout.line_items.map((item) => item.product_id)
    );
    if (hasCampaign) showPopup(triggers.thankYou);
  };

  const checkForProductAdd = (url) => {
    if (url && url.match(/cart\/add/)) document.dispatchEvent(productAddEvent);
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
      return oldOpen.apply(this, method, url, async, user, password);
    };
  };

  const initFetchMonkeyPatch = () => {
    const oldFetch = window.fetch;
    window.fetch = (url, options) => {
      checkForProductAdd(url);
      return oldFetch(url, options);
    };
  };

  const init = () => {
    // These 2 monkey patches are needed so we can detect products being added on the add to cart form
    // The issue is that if that add to cart is really a form, we don't have a way to tell if any other
    // JS is already adding the product to the cart, so we have to monitor XHR and fetch requests.
    initXHRMonkeyPatch();
    initFetchMonkeyPatch();
    const path = window.location.pathname;
    const productPage = path.match(/\/products\/[^?/#]+/);
    const thankYouPage = path.match(/\/thank_you$/);
    if (productPage) {
      handleProductPage(productPage);
    } else if (thankYouPage) {
      handleThankYouPage();
    }
    handleCart();
  };

  init();
})();
