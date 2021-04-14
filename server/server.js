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

import {
  sentryErrorMiddleware,
  sentryRequestMiddleware,
  sentryTracingMiddleware,
} from './middleware/sentry';
import shopifyAuth from './middleware/shopify-auth';
import countView from './controllers/count_view';
import createDraftOrder from './controllers/create_draft_order';
import getMatchingCampaign from './controllers/get_matching_campaign';
import saveCampaign from './controllers/save_campaign';
import deleteCampaign from './controllers/delete_campaign';
import publishCampaign from './controllers/publish_campaign';
import unpublishCampaign from './controllers/unpublish_campaign';
import enableStore from './controllers/enable_store';
import manageSubscription from './controllers/manage_subscription';
import processWithNext from './controllers/process_with_next';
import duplicateCampaign from './controllers/duplicate_campaign';
import respondOk from './controllers/respond_ok';
import subscriptionUpdate from './controllers/subscription_update';
import draftOrdersUpdate from './controllers/draft_orders_update';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const port = parseInt(process.env.PORT, 10) || 8081;
const app = next({ dev: !isProduction });

// eslint-disable-next-line promise/catch-or-return
app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  const webhook = receiveWebhook({ secret: process.env.SHOPIFY_API_SECRET });

  Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.5 });

  router.post('/webhooks/customers/redact', respondOk);
  router.post('/webhooks/shop/redact', webhook, respondOk);
  router.post('/webhooks/customers/data_request', webhook, respondOk);
  router.post(
    '/webhooks/app_subscriptions/update',
    webhook,
    subscriptionUpdate
  );
  router.post('/webhooks/draft_orders/update', webhook, draftOrdersUpdate);
  router.post('/api/get-matching-campaign', getMatchingCampaign);
  router.post('/api/create-draft-order', createDraftOrder);
  router.post('/api/count-view', countView);
  router.get('(.*)', verifyRequest(), processWithNext(app));
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
  router.post(
    '/api/duplicate-campaign/:id',
    verifyRequest(),
    duplicateCampaign
  );

  server.on('error', sentryErrorMiddleware);
  server.use(sentryRequestMiddleware);
  server.use(sentryTracingMiddleware);
  server.use(session({ sameSite: 'none', secure: true }, server));
  server.keys = [process.env.SHOPIFY_API_SECRET];
  server.use(createShopifyAuth(shopifyAuth));
  server.use(graphQLProxy({ version: ApiVersion.October20 }));
  server.use(bodyParser());
  server.use(Cors({ credentials: true }));
  server.use(router.allowedMethods());
  server.use(router.routes());

  const readyFunc = () => console.log(`> Ready on http://localhost:${port}`);
  if (isProduction) {
    server.listen(port, readyFunc);
  } else {
    const sslKey = fs
      .readFileSync(path.resolve(process.cwd(), 'certs/key.pem'), 'utf8')
      .toString();
    const sslCert = fs
      .readFileSync(path.resolve(process.cwd(), 'certs/cert.pem'), 'utf8')
      .toString();
    https
      .createServer({ port, key: sslKey, cert: sslCert }, server.callback())
      .listen({ port }, readyFunc);
  }
});
