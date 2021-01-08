(async function () {
  const popupId = 'salestorm';

  const managePopup = (campaign) => {
    // TODO: Add button click handlers and show the popup correctly

    document.body.insertAdjacentHTML('beforeend', campaign.html);
  };

  const getMatchingCampaign = async (trigger, products) => {
    try {
      const response = await fetch(
        'https://a1bd057f095d.ngrok.io/api/get-matching-campaign',
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
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(window.Shopify);
      throw error;
    }
  };

  const showPopup = () => {
    document.getElementById(popupId).style.display = 'block';
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
    const campaign = await getMatchingCampaign('add_to_cart', [productId]);
    managePopup(campaign);

    Array.from(document.forms)
      .filter((form) => form.action.includes('cart/add'))
      .filter((form) => form.querySelector(':enabled[type="submit"]'))
      .forEach((form) => form.addEventListener('submit', showPopup));
  };

  const handleCartPage = async (previousItems) => {
    const response = await fetch('/cart.js');
    const cart = await response.json();
    const currentItems = cart.items;
    if (
      !previousItems ||
      JSON.stringify(currentItems) !== JSON.stringify(previousItems)
    ) {
      const campaign = await getMatchingCampaign(
        'checkout',
        currentItems.map((item) => item.product_id)
      );
      managePopup(campaign);
    }
    setTimeout(() => handleCartPage(currentItems), 3000);
  };

  const handleThankYouPage = async () => {
    const campaign = await getMatchingCampaign(
      'thank_you',
      window.Shopify.checkout.line_items.map((item) => item.product_id)
    );
    managePopup(campaign);
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
