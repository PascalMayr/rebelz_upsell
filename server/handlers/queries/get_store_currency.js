import gql from 'graphql-tag';

const GET_STORE_CURRENCY = gql`
  query storeCurrency {
    shop {
      currencyCode
    }
  }
`;

export default GET_STORE_CURRENCY;
