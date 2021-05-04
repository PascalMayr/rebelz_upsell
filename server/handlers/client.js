import { ApolloClient, InMemoryCache } from '@apollo/client';

export const createClient = (shop, accessToken) => {
  return new ApolloClient({
    uri: `https://${shop}/admin/api/2021-04/graphql.json`,
    cache: new InMemoryCache(),
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'User-Agent': `shopify-app-node ${process.env.npm_package_version} | Shopify App CLI`,
    }
  });
};
