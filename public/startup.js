(async function () {
  const popupId = 'salestorm';

  const managePopup = (campaign) => {
    // TODO: Add button click handlers and show the popup correctly

    const popup = document.createElement('div');
    popup.id = popupId;
    popup.innerHTML = campaign.html;

    document.body.appendChild(popup);
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
    let product;
    if (typeof meta !== 'undefined' && window.meta.product) {
      product = window.meta.product;
    } else {
      const response = await fetch(`${productPage[0]}.js`);
      product = await response.json();
    }
    const campaign = await getMatchingCampaign('add_to_cart', [product]);
    managePopup(campaign);

    Array.from(document.forms)
      .filter((form) => form.action.includes('cart/add'))
      .filter((form) => form.querySelector(':enabled[type="submit"]'))
      .forEach((form) => form.addEventListener('submit', showPopup));
  };

  const handleCartPage = async () => {
    // TODO: Get this every 3 seconds and check for changes to it
    const response = await fetch('/cart.js');
    const cart = await response.json();
    const campaign = await getMatchingCampaign('checkout', cart.items);
    managePopup(campaign);
  };

  const handleThankYouPage = async () => {
    const campaign = await getMatchingCampaign(
      'thank_you',
      window.Shopify.checkout.line_items
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
