import 'isomorphic-fetch';
import { gql } from 'apollo-boost';

export function SCRIPT_TAG_CREATE() {
  return gql`
    mutation scriptTagCreate($url: String!) {
      scriptTagCreate(input: { src: $url }) {
        userErrors {
          field
          message
        }
        scriptTag {
          id
        }
      }
    }
  `;
}

export const getScriptTagId = async ({ client }) => {
  const response = await client.mutate({
    mutation: SCRIPT_TAG_CREATE(),
    variables: { url: `${process.env.HOST}/startup.js` },
  });
  return response.data.scriptTagCreate.scriptTag.id;
};
