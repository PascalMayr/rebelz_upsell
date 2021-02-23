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
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { AppProvider } from '@shopify/polaris';
import translations from '@shopify/polaris/locales/en.json';

import Popup from '../components/popup/preview';
import customElement from '../components/popup/templates/debut/custom_element';
import config from '../config';

import db from './db';
import {
  createClient,
  getScriptTagId,
  getSubscriptionUrl,
  cancelSubscription,
  registerWebhooks,
} from './handlers';

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

  router.post('/api/get-matching-campaign', async (ctx) => {
    const { shop, target, products } = ctx.request.body;
    const campaigns = await db.query(
      `SELECT *
      FROM campaigns
      INNER JOIN stores ON stores.domain = campaigns.domain
      WHERE campaigns.domain = $1
      AND stores.enabled = true
      AND campaigns.published = true`,
      [shop]
    );
    const campaign = campaigns.rows.find(
      (row) =>
        row.targets.page === target &&
        row.targets.products.some((targetProduct) =>
          products.includes(parseInt(targetProduct.legacyResourceId, 10))
        )
    );
    if (campaign) {
      const { customJS, id } = campaign;
      const html = await ReactDOMServer.renderToStaticMarkup(
        <AppProvider i18n={translations}>
          <Popup campaign={campaign} />
        </AppProvider>
      );
      ctx.body = {
        html,
        js: customElement(customJS),
        id,
      };
      ctx.status = 200;
    } else {
      ctx.status = 404;
    }
  });

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
    const configPlan = config.plans.find((p) => p.name === name);
    if (status === 'ACTIVE') {
      await db.query(
        'UPDATE stores SET plan_name = $1, "subscriptionId" = $2, plan_limit = $3 WHERE domain = $4',
        [name, subscriptionId, configPlan.limit, shop]
      );
    } else if (store.subscriptionId === subscriptionId) {
      const freePlan = config.plans.find(
        (p) => p.name === config.planNames.free
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

        const store = await db.query('SELECT * FROM stores WHERE domain = $1', [
          shop,
        ]);
        if (store.rowCount === 0) {
          const scriptid = await getScriptTagId(ctx);
          const freePlan = config.plans.find(
            (p) => p.name === config.planNames.free
          );
          await db.query(
            `INSERT INTO stores${db.insertColumns(
              'domain',
              'scriptId',
              'plan_limit'
            )}`,
            [shop, scriptid, freePlan.limit]
          );
          registerWebhooks(
            shop,
            accessToken,
            'APP_SUBSCRIPTIONS_UPDATE',
            '/webhooks/app_subscriptions/update',
            ApiVersion.October20
          );
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

  router.post('/api/save-campaign', verifyRequest(), async (ctx) => {
    const requestBody = ctx.request.body;

    let campaign;

    const createUpdateArray = (body) => {
      const id = body.id;
      delete body.id;
      return Object.keys(body)
        .map((key) => body[key])
        .concat([id]);
    };

    const createUpdateQuery = (body) => {
      const keysArray = Object.keys(body);
      const query = `Update campaigns SET ${keysArray
        .map((key, index) => `"${key}" = $${index + 1}`)
        .join(', ')} WHERE id = $${keysArray.length + 1} RETURNING *`;
      return query;
    };

    if (requestBody.id) {
      const updateValues = createUpdateArray(requestBody);
      campaign = await db.query(createUpdateQuery(requestBody), updateValues);
    } else {
      const helper = requestBody;
      helper.domain = ctx.session.shop;
      const columns = Object.keys(helper).map((key) => `"${key}"`);
      const helperArray = Object.keys(helper).map((key) => helper[key]);
      const query = `INSERT INTO campaigns (${columns.join(
        ','
      )}) VALUES (${columns
        .map((_col, i) => `$${i + 1}`)
        .join(',')}) RETURNING *`;
      campaign = await db.query(query, [...helperArray]);
    }
    ctx.body = campaign.rows[0];
    ctx.status = 200;
  });

  router.delete('/api/delete-campaign/:id', verifyRequest(), async (ctx) => {
    await db.query('DELETE FROM campaigns WHERE id = $1 AND domain = $2', [
      ctx.params.id,
      ctx.session.shop,
    ]);

    ctx.status = 200;
  });

  router.post('/api/publish-campaign', verifyRequest(), async (ctx) => {
    await db.query('UPDATE campaigns SET published = true WHERE domain = $1', [
      ctx.session.shop,
    ]);

    ctx.status = 200;
  });

  router.delete('/api/unpublish-campaign', verifyRequest(), async (ctx) => {
    await db.query('UPDATE campaigns SET published = false WHERE domain = $1', [
      ctx.session.shop,
    ]);

    ctx.status = 200;
  });

  router.patch('/api/store/enable', verifyRequest(), async (ctx) => {
    await db.query('UPDATE stores SET enabled = $1 WHERE domain = $2', [
      ctx.request.body.enabled,
      ctx.session.shop,
    ]);

    ctx.status = 200;
  });

  router.patch('/api/plan', verifyRequest(), async (ctx) => {
    const { plan } = ctx.request.body;
    const { shop, accessToken } = ctx.session;
    const storeData = await db.query('SELECT * FROM stores WHERE domain = $1', [
      ctx.session.shop,
    ]);
    const store = storeData.rows[0];
    server.context.client = await createClient(shop, accessToken);

    if (store.plan_name === plan) {
      await cancelSubscription(ctx, store.subscriptionId);
      const freePlan = config.plans.find(
        (configPlan) => configPlan.name === config.planNames.free
      );
      await db.query(
        'UPDATE stores SET plan_name = NULL, "subscriptionId" = NULL, plan_limit = $1 WHERE domain = $2',
        [freePlan.limit, ctx.session.shop]
      );

      ctx.body = {};
      ctx.status = 200;
    } else {
      const currentPlan = config.plans.find(
        (configPlan) => configPlan.name === plan
      );
      const { confirmationUrl } = await getSubscriptionUrl(ctx, currentPlan);

      ctx.body = { confirmationUrl };
    }
  });

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
