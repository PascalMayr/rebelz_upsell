import 'isomorphic-fetch';
import gql from 'graphql-tag';

const CDN_URL = 'https://cdn.jsdelivr.net/gh/mayrsascha/rebelz_startup@v1/startup.js';

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

export const getScriptTagId = async ({ client }) => {
  const response = await client.mutate({
    mutation: SCRIPT_TAG_CREATE(),
    variables: { input: { src: CDN_URL } },
  });
  return response.data.scriptTagCreate.scriptTag.id;
};
