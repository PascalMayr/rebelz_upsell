import { ApolloClient, InMemoryCache } from '@apollo/client';

export const createClient = (shop, accessToken) => {
  if (
    process.env.NODE_ENV === 'development' &&
    !process.env.PRIVATE_ACCESS_TOKEN
  ) {
    throw new Error(
      'PRIVATE_ACCESS_TOKEN env missing. Go to the dev store, create a private App, get the access token and set the missing env.'
    );
  }
  return new ApolloClient({
    uri: `https://${shop}/admin/api/2021-04/graphql.json`,
    cache: new InMemoryCache(),
    headers: {
      'X-Shopify-Access-Token':
        process.env.NODE_ENV === 'development'
          ? process.env.PRIVATE_ACCESS_TOKEN
          : accessToken,
      'User-Agent': `shopify-app-node ${process.env.npm_package_version} | Shopify App CLI`,
    },
  });
};
