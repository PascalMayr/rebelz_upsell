import 'isomorphic-fetch';
import { gql } from 'apollo-boost';

export function RECURRING_CREATE() {
  return gql`
    mutation {
      appSubscriptionCreate(
          name: "Super Duper Plan"
          returnUrl: $url: String!
          test: true
          lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                  price: { amount: 10, currencyCode: USD }
              }
            }
          }
          ]
        ) {
            userErrors {
              field
              message
            }
            confirmationUrl
            appSubscription {
              id
            }
        }
    }`;
}

export const getSubscriptionUrl = async (ctx) => {
  const { client } = ctx;
  const response = await client.mutate({
    mutation: RECURRING_CREATE(),
    variables: { url: process.env.HOST },
  });
  return ctx.redirect(response.data.appSubscriptionCreate.confirmationUrl);
};
