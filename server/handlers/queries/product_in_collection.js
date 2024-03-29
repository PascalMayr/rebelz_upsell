import gql from 'graphql-tag';

const PRODUCT_IN_COLLECTION = gql`
  query ProductInCollection($product: ID!, $collection: ID!) {
    product(id: $product) {
      inCollection(id: $collection)
    }
  }
`;

export default PRODUCT_IN_COLLECTION;
