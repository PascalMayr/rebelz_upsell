import { ApiVersion } from '@shopify/koa-shopify-graphql-proxy';

import config from '../../config';
import db from '../db';
import { createClient, getScriptTagId, registerWebhooks } from '../handlers';

const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY, SCOPES } = process.env;

const shopifyAuth = {
  apiKey: SHOPIFY_API_KEY,
  secret: SHOPIFY_API_SECRET,
  scopes: [SCOPES],

  async afterAuth(ctx) {
    // Auth token and shop available in session
    // Redirect to shop upon auth
    const {
      shop,
      accessToken,
      associatedUserScope,
      associatedUser,
    } = ctx.session;
    const {
      id,
      first_name,
      last_name,
      email,
      account_owner,
      locale,
    } = associatedUser;
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
        associatedUserScope,
        first_name,
        last_name,
        email,
        account_owner,
        locale,
      ]
    );
    ctx.cookies.set('shopOrigin', shop, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
    });
    ctx.redirect('/');
  },
};

export default shopifyAuth;
