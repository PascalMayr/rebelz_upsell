import gql from 'graphql-tag';

const GET_SCRIPT_TAG = gql`
  query getScriptTag($id: ID!) {
    scriptTag(id: $id) {
      src
    }
  }
`;

export default GET_SCRIPT_TAG;
