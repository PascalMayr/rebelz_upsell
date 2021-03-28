import { gql } from 'apollo-boost';

const GET_STORE_CURRENCY = gql`
  query storeCurrency {
    shop {
      currencyCode
    }
  }
`;

export default GET_STORE_CURRENCY;
