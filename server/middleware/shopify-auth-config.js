import Shopify, { ApiVersion } from '@shopify/shopify-api';

import config from '../../config';
import db from '../db';
import { createClient, getScriptTagId, registerWebhooks } from '../handlers';

const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY, SCOPES, HOST } = process.env;

Shopify.Context.initialize({
  API_KEY: SHOPIFY_API_KEY,
  API_SECRET_KEY: SHOPIFY_API_SECRET,
  SCOPES: SCOPES.split(','),
  HOST_NAME: HOST.replace(/^https:\/\//, ''),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

const shopifyAuthConfig = {
  async afterAuth(ctx) {
    // Auth token and shop available in session
    // Redirect to shop upon auth
    const { shop, scope, accessToken, onlineAccessInfo } = ctx.state.shopify;
    global.ACTIVE_SHOPIFY_SHOPS[shop] = scope;
    const {
      id,
      first_name: firstName,
      last_name: lastName,
      email,
      account_owner: accountOwner,
      locale,
    } = onlineAccessInfo.associated_user;
    ctx.client = await createClient(shop, accessToken);
    const scriptid = await getScriptTagId(ctx);
    const freePlan = config.plans.find(
      (plan) => plan.name === config.planNames.free
    );
    await db.query(
      `INSERT INTO stores${db.insertColumns(
        'domain',
        'scriptId',
        'plan_limit',
        'access_token'
      )}
      ON CONFLICT (domain) DO UPDATE SET
      scriptId = $2,
      access_token = $4
      `,
      [shop, scriptid, freePlan.limit, accessToken]
    );
    registerWebhooks(
      shop,
      accessToken,
      'APP_SUBSCRIPTIONS_UPDATE',
      '/webhooks/app_subscriptions/update',
      ApiVersion.October20
    );
    registerWebhooks(
      shop,
      accessToken,
      'DRAFT_ORDERS_UPDATE',
      '/webhooks/draft_orders/update',
      ApiVersion.October20
    );
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
    ctx.redirect(`/?shop=${shop}`);
  },
};

export default shopifyAuthConfig;
