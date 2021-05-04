import Shopify, { ApiVersion } from '@shopify/shopify-api';

import config from '../../config';
import db from '../db';
import { createClient, getScriptTagId, registerWebhooks } from '../handlers';
import GET_SCRIPT_TAG from '../handlers/queries/get_script_tag';
import {
  storeCallback,
  loadCallback,
  deleteCallback,
} from '../handlers/session';

const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY, SCOPES, HOST } = process.env;

Shopify.Context.initialize({
  API_KEY: SHOPIFY_API_KEY,
  API_SECRET_KEY: SHOPIFY_API_SECRET,
  SCOPES: SCOPES.split(','),
  HOST_NAME: HOST.replace(/^https:\/\//, ''),
  API_VERSION: ApiVersion.April21,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.CustomSessionStorage(
    storeCallback,
    loadCallback,
    deleteCallback
  ),
});

export const onlineAuthConfig = {
  async afterAuth(ctx) {
    // Auth token and shop available in session
    const { shop, onlineAccessInfo, accessToken } = ctx.state.shopify;
    const {
      id,
      first_name: firstName,
      last_name: lastName,
      email,
      account_owner: accountOwner,
      locale,
    } = onlineAccessInfo.associated_user;
    let activeStore = await db.query('SELECT * FROM stores WHERE domain = $1', [
      shop,
    ]);
    activeStore = activeStore.rows[0];

    const client = await createClient(shop, accessToken);
    const scriptTagResponse = await client.query({
      query: GET_SCRIPT_TAG,
      variables: {
        id: activeStore.scriptid,
      },
    });
    if (scriptTagResponse.data) {
      // This can happen on re-install
      if (!scriptTagResponse.data.scriptTag) {
        const scriptid = await getScriptTagId(client);
        await db.query('UPDATE stores SET scriptid = $1 WHERE domain = $2', [scriptid, shop]);
      }
    } else {
      throw new Error(`Failed to check script tag for store ${shop}`);
    }

    await db.query(
      `
      INSERT INTO users${db.insertColumns(
        'id',
        'domain',
        'associated_user_scope',
        'first_name',
        'last_name',
        'email',
        'account_owner',
        'locale'
      )}
      ON CONFLICT (id) DO UPDATE SET
      associated_user_scope = $3,
      first_name = $4,
      last_name = $5,
      email = $6,
      account_owner = $7,
      locale = $8
    `,
      [
        id,
        shop,
        onlineAccessInfo.associated_user_scope,
        firstName,
        lastName,
        email,
        accountOwner,
        locale,
      ]
    );
    // Redirect to shop upon auth
    ctx.redirect(`/home?shop=${shop}`);
  },
};

export const offlineAuthConfig = {
  prefix: '/offline',
  accessMode: 'offline',
  async afterAuth(ctx) {
    // Auth token and shop available in session
    const { shop, accessToken } = ctx.state.shopify;
    let activeStore = await db.query('SELECT * FROM stores WHERE domain = $1', [
      shop,
    ]);
    activeStore = activeStore.rows[0];
    if (activeStore) {
      await db.query(`UPDATE stores SET access_token = $1 WHERE domain = $2`, [
        accessToken,
        shop,
      ]);
    } else {
      const client = await createClient(shop, accessToken);
      const scriptid = await getScriptTagId(client);
      registerWebhooks(
        shop,
        accessToken,
        'APP_SUBSCRIPTIONS_UPDATE',
        '/webhooks/app_subscriptions/update',
        ApiVersion.April21
      );
      registerWebhooks(
        shop,
        accessToken,
        'DRAFT_ORDERS_UPDATE',
        '/webhooks/draft_orders/update',
        ApiVersion.April21
      );
      registerWebhooks(
        shop,
        accessToken,
        'APP_UNINSTALLED',
        '/webhooks/app/uninstalled',
        ApiVersion.April21
      );

      const freePlan = config.plans.find(
        (plan) => plan.name === config.planNames.free
      );
      await db.query(
        `INSERT INTO stores${db.insertColumns(
          'domain',
          'scriptId',
          'plan_limit',
          'plan_name',
          'access_token'
        )}`,
        [shop, scriptid, freePlan.limit, config.planNames.free, accessToken]
      );
    }
    // Redirect to online auth after offline auth
    ctx.redirect(`/?shop=${shop}`);
  },
};
