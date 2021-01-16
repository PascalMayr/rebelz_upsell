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

import { createClient, getScriptTagId } from './handlers';
import db from './db';

dotenv.config();

const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== 'production';
const app = next({
  dev,
});
const handle = app.getRequestHandler();
const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY, SCOPES } = process.env;

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  router.post('/api/get-matching-campaign', async (ctx) => {
    const { shop, trigger, products } = ctx.request.body;
    const campaigns = await db.query(
      `SELECT *
      FROM campaigns
      INNER JOIN stores ON stores.domain = campaigns.domain
      WHERE campaigns.domain = $1
      AND stores.enabled = true
      AND campaigns.published = true
      AND campaigns.trigger = $2`,
      [shop, trigger]
    );
    const campaign = campaigns.rows.find((row) => {
      return row.products.targets.some((targetProduct) =>
        products.includes(targetProduct.legacyResourceId)
      );
    });

    if (campaign) {
      // TODO: Render popup here
      ctx.body = { html: campaign.message };
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
  if (process.env.NODE_ENV !== 'localdevelopment') {
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

          const store = await db.query(
            'SELECT * FROM stores WHERE domain = $1',
            [shop]
          );
          if (store.rowCount === 0) {
            const scriptid = await getScriptTagId(ctx);
            await db.query(
              'INSERT INTO stores(domain, scriptid) VALUES($1, $2)',
              [shop, scriptid]
            );
          }
          await db.query(
            `
            INSERT INTO users(id, domain, associated_user_scope, first_name, last_name, email, account_owner, locale)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8)
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
  }
  server.use(
    graphQLProxy({
      version: ApiVersion.October20,
    })
  );
  server.use(bodyParser());
  if (process.env.NODE_ENV !== 'localdevelopment') {
    router.get('(.*)', verifyRequest(), async (ctx) => {
      await handle(ctx.req, ctx.res);
      ctx.respond = false;
      ctx.res.statusCode = 200;
    });
  } else {
    router.get('(.*)', async (ctx) => {
      await handle(ctx.req, ctx.res);
      ctx.respond = false;
      ctx.res.statusCode = 200;
    });
  }

  router.post('/api/save-campaign', verifyRequest(), async (ctx) => {
    const {
      styles,
      mobileStyles,
      trigger,
      sellType,
      name,
      products,
      customCSS,
      customJS,
      animation
    } = ctx.request.body;
    let campaign;
    if (ctx.request.body.id) {
      campaign = await db.query(
        'UPDATE campaigns SET styles = $1, trigger = $2, "sellType" = $3, name = $4, "mobileStyles" = $5, products = $6, "customCSS" = $7, "customJS" = $8, animation = $9 WHERE id = $10 RETURNING *',
        [
          styles,
          trigger,
          sellType,
          name,
          mobileStyles,
          products,
          customCSS,
          customJS,
          animation,
          ctx.request.body.id,
        ]
      );
    } else {
      campaign = await db.query(
        'INSERT INTO campaigns(domain, styles, trigger, "sellType", name, "mobileStyles", products, "customCSS", "customJS", animation) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        [
          ctx.session.shop,
          styles,
          trigger,
          sellType,
          name,
          mobileStyles,
          products,
          customCSS,
          customJS,
          animation,
        ]
      );
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

  server.use(Cors({ credentials: true }));
  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
