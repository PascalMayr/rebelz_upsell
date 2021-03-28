import { gql } from 'apollo-boost';

const GET_COLLECTION = gql`
  query Product($id: ID!) {
    collection(id: $id) {
      id
      image {
        transformedSrc(maxHeight: 75)
      }
      title
    }
  }
`;

export default GET_COLLECTION;
