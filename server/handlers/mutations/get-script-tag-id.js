import 'isomorphic-fetch';
import gql from 'graphql-tag';

const CDN_URL = process.env.NODE_ENV === 'production' ?
  'https://cdn.jsdelivr.net/gh/mayrsascha/rebelz_startup@v5/startup.js' :
  'https://loop.rebelzcommerce.com/startup.js';

export function SCRIPT_TAG_CREATE() {
  return gql`
    mutation scriptTagCreate($input: ScriptTagInput!) {
      scriptTagCreate(input: $input) {
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

export const getScriptTagId = async (client) => {
  const response = await client.mutate({
    mutation: SCRIPT_TAG_CREATE(),
    variables: { input: { src: CDN_URL } },
  });
  return response.data.scriptTagCreate.scriptTag.id;
};
