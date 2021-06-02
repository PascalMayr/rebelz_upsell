import 'isomorphic-fetch';
import gql from 'graphql-tag';

export function RECURRING_CREATE() {
  return gql`
    mutation(
      $url: URL!
      $test: Boolean!
      $name: String!
      $amount: Decimal!
      $currency: CurrencyCode!
    ) {
      appSubscriptionCreate(
        name: $name
        returnUrl: $url
        test: $test
        lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                price: { amount: $amount, currencyCode: $currency }
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
    }
  `;
}

export const getSubscriptionUrl = async (ctx, { name, amount, currency }, storeDomain) => {
  const { client } = ctx;
  const response = await client.mutate({
    mutation: RECURRING_CREATE(),
    variables: {
      url: `${process.env.HOST}?shop=${storeDomain}`,
      test: process.env.BILLING_TEST === 'true' ? true : null,
      name,
      amount,
      currency,
    },
  });
  return response.data.appSubscriptionCreate;
};
