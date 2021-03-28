const restClient = (shop, endpoint, accessToken, options = {}) => {
  return fetch(`https://${shop}/admin/api/2021-01/${endpoint}.json`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    ...options,
  });
};

export default restClient;
