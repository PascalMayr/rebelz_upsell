(async function () {
  const triggers = {
    addToCart: 'add_to_cart',
    checkout: 'checkout',
    thankYou: 'thank_you',
  };
  const addToCartButton = [
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
  const checkoutButton = ['[name="checkout"]', 'a[href^="/checkout"]'];
  const popupId = 'salestorm';

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
        return campaign;
      } else {
        return null;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(window.Shopify);
      throw error;
    }
  };

  const renderCampaign = async (trigger, products) => {
    const campaign = await fetchCampaign(trigger, products);
    if (!campaign) return;

    document.body.insertAdjacentHTML('beforeend', campaign.html);

    const showPopup = () => {
      document.getElementById(popupId).style.display = 'block';
    };

    switch (trigger) {
      case triggers.addToCart: {
        document
          .querySelector(addToCartButton)
          .addEventListener('click', showPopup);
        break;
      }
      case triggers.checkout: {
        document.querySelector(checkoutButton).addEventListener(
          'click',
          (e) => {
            e.preventDefault();
            showPopup();
            return false;
          },
          true
        );
        break;
      }
      case triggers.thankYou: {
        showPopup();
        break;
      }
    }
  };

  const handleProductPage = async (productPage) => {
    let productId;
    if (typeof meta !== 'undefined' && window.meta.product) {
      productId = window.meta.product.id;
    } else {
      const response = await fetch(`${productPage[0]}.js`);
      const product = await response.json();
      productId = product.id;
    }
    await renderCampaign(triggers.addToCart, [productId]);
  };

  const handleCartPage = async (previousItems) => {
    const response = await fetch('/cart.js');
    const cart = await response.json();
    const currentItems = cart.items;
    if (
      !previousItems ||
      JSON.stringify(currentItems) !== JSON.stringify(previousItems)
    ) {
      await renderCampaign(
        triggers.checkout,
        currentItems.map((item) => item.product_id)
      );
    }
    setTimeout(() => handleCartPage(currentItems), 3000);
  };

  const handleThankYouPage = async () => {
    await renderCampaign(
      triggers.thankYou,
      window.Shopify.checkout.line_items.map((item) => item.product_id)
    );
  };

  const init = async () => {
    const path = window.location.pathname;
    const productPage = path.match(/\/products\/[^?/#]+/);
    const cartPage = path.match(/^\/cart/);
    const thankYouPage = path.match(/\/thank_you$/);
    if (productPage) {
      handleProductPage(productPage);
    } else if (cartPage) {
      await handleCartPage();
    } else if (thankYouPage) {
      await handleThankYouPage();
    }
  };

  await init();
})();
