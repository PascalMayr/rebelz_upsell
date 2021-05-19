import gql from 'graphql-tag';

const GET_ORDER = gql`
  query get_order($id: ID!) {
    order(id: $id) {
      customer {
        legacyResourceId
      }
    }
  }
`;

export default GET_ORDER;
