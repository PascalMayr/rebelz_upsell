import 'isomorphic-fetch';
import gql from 'graphql-tag';

export function CANCEL_RECURRING() {
  return gql`
    mutation($id: ID!) {
      appSubscriptionCancel(id: $id) {
        userErrors {
          field
          message
        }
      }
    }
  `;
}

export const cancelSubscription = async (ctx, id) => {
  const { client } = ctx;
  const response = await client.mutate({
    mutation: CANCEL_RECURRING(),
    variables: { id },
  });
  return response.data.appSubscriptionCancel;
};
