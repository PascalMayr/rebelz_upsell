import { gql } from 'apollo-boost';

const GET_PRODUCT = gql`
  query Product($id: ID!) {
    product(id: $id) {
      id
      legacyResourceId
      title
      descriptionHtml
      hasOutOfStockVariants
      hasOnlyDefaultVariant
      totalVariants
      status
      handle
      options(first: 3) {
        values
        name
        position
      }
      featuredImage {
        transformedSrc(maxHeight: 500)
        altText
      }
      variants(first: 10) {
        edges {
          node {
            title
            id
            legacyResourceId
            availableForSale
            price
            selectedOptions {
              name
              value
            }
            image {
              transformedSrc(maxHeight: 500)
            }
          }
        }
      }
      updatedAt
      createdAt
    }
  }
`;

export default GET_PRODUCT;
