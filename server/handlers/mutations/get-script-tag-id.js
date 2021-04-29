import 'isomorphic-fetch';
import gql from 'graphql-tag';

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
    variables: { input: { src: `${process.env.HOST}/startup.js` } },
  });
  return response.data.scriptTagCreate.scriptTag.id;
};
