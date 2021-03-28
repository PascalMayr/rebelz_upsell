import fs from 'fs';
import https from 'https';
import path from 'path';

import '@babel/polyfill';
import dotenv from 'dotenv';
import 'isomorphic-fetch';
import createShopifyAuth, { verifyRequest } from '@shopify/koa-shopify-auth';
import graphQLProxy, { ApiVersion } from '@shopify/koa-shopify-graphql-proxy';
import { receiveWebhook } from '@shopify/koa-shopify-webhooks';
import Koa from 'koa';
import next from 'next';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import Cors from '@koa/cors';
import session from 'koa-session';
import * as Sentry from '@sentry/node';

import config from '../config';

import {
  sentryErrorMiddleware,
  sentryRequestMiddleware,
  sentryTracingMiddleware,
} from './middleware/sentry';
import db from './db';
import { createClient, getScriptTagId, registerWebhooks } from './handlers';
import countView from './controllers/count_view';
import createDraftOrder from './controllers/create_draft_order';
import getMatchingCampaign from './controllers/get_matching_campaign';
import saveCampaign from './controllers/save_campaign';
import deleteCampaign from './controllers/delete_campaign';
import publishCampaign from './controllers/publish_campaign';
import unpublishCampaign from './controllers/unpublish_campaign';
import enableStore from './controllers/enable_store';
import manageSubscription from './controllers/manage_subscription';
import getCampaigns from './controllers/get_campaigns';
import duplicateCampaign from './controllers/duplicate_campaign';

dotenv.config();

const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY, SCOPES, NODE_ENV } = process.env;
const isProduction = NODE_ENV === 'production';
const port = parseInt(process.env.PORT, 10) || 8081;
const app = next({
  dev: !isProduction,
});
const handle = app.getRequestHandler();

// eslint-disable-next-line promise/catch-or-return
app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.5,
  });

  server.on('error', sentryErrorMiddleware);
  server.use(sentryRequestMiddleware);
  server.use(sentryTracingMiddleware);

  router.post('/api/get-matching-campaign', getMatchingCampaign);

  router.post('/api/create-draft-order', createDraftOrder);

  router.post('/api/count-view', countView);

  const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET });

  router.post('/webhooks/customers/redact', webhook, (ctx) => {
    ctx.body = {};
    ctx.status = 200;
  });

  router.post('/webhooks/shop/redact', webhook, (ctx) => {
    ctx.body = {};
    ctx.status = 200;
  });

  router.post('/webhooks/customers/data_request', webhook, (ctx) => {
    ctx.body = {};
    ctx.status = 200;
  });

  router.post('/webhooks/app_subscriptions/update', webhook, async (ctx) => {
    const shop = ctx.request.headers['x-shopify-shop-domain'];
    const {
      name,
      status,
      admin_graphql_api_id: subscriptionId,
    } = ctx.request.body.app_subscription;
    const storeData = await db.query('SELECT * FROM stores WHERE domain = $1', [
      shop,
    ]);
    const store = storeData.rows[0];
    const configPlan = config.plans.find((plan) => plan.name === name);
    if (status === 'ACTIVE') {
      await db.query(
        'UPDATE stores SET plan_name = $1, "subscriptionId" = $2, plan_limit = $3 WHERE domain = $4',
        [name, subscriptionId, configPlan.limit, shop]
      );
    } else if (store.subscriptionId === subscriptionId) {
      const freePlan = config.plans.find(
        (plan) => plan.name === config.planNames.free
      );
      await db.query(
        'UPDATE stores SET plan_name = NULL, "subscriptionId" = NULL, plan_limit = $1 WHERE domain = $2',
        [freePlan.limit, shop]
      );
    }

    ctx.body = {};
    ctx.status = 200;
  });

  server.use(
    session(
      {
        sameSite: 'none',
        secure: true,
      },
      server
    )
  );
  server.keys = [SHOPIFY_API_SECRET];
  server.use(
    createShopifyAuth({
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
        server.context.client = await createClient(shop, accessToken);
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
    })
  );
  server.use(
    graphQLProxy({
      version: ApiVersion.October20,
    })
  );

  server.use(bodyParser());
  router.get('(.*)', verifyRequest(), async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });

  router.post('/api/save-campaign', verifyRequest(), saveCampaign);

  router.delete('/api/delete-campaign/:id', verifyRequest(), deleteCampaign);

  router.post('/api/publish-campaign/:id', verifyRequest(), publishCampaign);

  router.delete(
    '/api/unpublish-campaign/:id',
    verifyRequest(),
    unpublishCampaign
  );

  router.patch('/api/store/enable', verifyRequest(), enableStore);

  router.patch('/api/plan', verifyRequest(), manageSubscription);

  router.post('/api/campaigns', verifyRequest(), getCampaigns);

  router.post(
    '/api/duplicate-campaign/:id',
    verifyRequest(),
    duplicateCampaign
  );

  server.use(Cors({ credentials: true }));
  server.use(router.allowedMethods());
  server.use(router.routes());
  const readyFunc = () => console.log(`> Ready on http://localhost:${port}`);
  if (isProduction) {
    server.listen(port, readyFunc);
  } else {
    https
      .createServer(
        {
          port,
          key: fs
            .readFileSync(path.resolve(process.cwd(), 'certs/key.pem'), 'utf8')
            .toString(),
          cert: fs
            .readFileSync(path.resolve(process.cwd(), 'certs/cert.pem'), 'utf8')
            .toString(),
        },
        server.callback()
      )
      .listen({ port }, readyFunc);
  }
});
