import 'isomorphic-fetch';
import { gql } from 'apollo-boost';

export function GET_ACTIVE_SUBSCRIPTIONS() {
  return gql`
    query {
      currentAppInstallation {
        activeSubscriptions {
          name
          id
        }
      }
    }
  `;
}

export const getActiveSubscription = async (ctx) => {
  const { client } = ctx;
  const response = await client.query({
    query: GET_ACTIVE_SUBSCRIPTIONS(),
  });
  return response.data.currentAppInstallation.activeSubscriptions[0];
};
