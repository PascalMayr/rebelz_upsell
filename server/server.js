/* eslint-disable babel/camelcase */
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
import { gql } from 'apollo-boost';
import * as Sentry from '@sentry/node';

import Popup from '../components/popup';
import customElement from '../components/popup/templates/debut/custom_element';
import config from '../config';

import {
  sentryErrorMiddleware,
  sentryRequestMiddleware,
  sentryTracingMiddleware,
} from './middleware/sentry';
import db from './db';
import {
  createClient,
  getScriptTagId,
  getSubscriptionUrl,
  cancelSubscription,
  registerWebhooks,
} from './handlers';
import countView from './controllers/count_view';

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

  router.post('/api/get-matching-campaign', async (ctx) => {
    const {
      shop,
      target,
      products,
      totalPrice,
      recommendations,
    } = ctx.request.body;

    const views = await db.query(
      "SELECT COUNT(*) FROM views WHERE domain = $1 AND date_part('month', views.view_time) = date_part('month', (SELECT current_timestamp))",
      [shop]
    );

    const store = await db.query(
      `SELECT * FROM stores WHERE stores.domain = $1`,
      [shop]
    );

    if (
      parseInt(views.rows[0].count, 10) >=
      parseInt(store.rows[0].plan_limit, 10)
    ) {
      ctx.status = 404;
      return;
    }

    const campaigns = await db.query(
      `SELECT *
      FROM campaigns
      INNER JOIN stores ON stores.domain = campaigns.domain
      WHERE campaigns.domain = $1
      AND stores.enabled = true
      AND campaigns.published = true`,
      [shop]
    );

    const accessToken = store.rows[0].access_token;
    const client = await createClient(shop, accessToken);

    const PRODUCT_IN_COLLECTION = gql`
      query ProductInCollection($product: ID!, $collection: ID!) {
        product(id: $product) {
          inCollection(id: $collection)
        }
      }
    `;

    const GET_PRODUCT = gql`
      query Product($id: ID!) {
        product(id: $id) {
          id
          legacyResourceId
          title
          descriptionHtml
          hasOutOfStockVariants
          hasOnlyDefaultVariant
          totalVariants
          status
          handle
          options(first: 3) {
            values
            name
            position
          }
          featuredImage {
            transformedSrc(maxHeight: 500)
            altText
          }
          variants(first: 10) {
            edges {
              node {
                title
                id
                legacyResourceId
                availableForSale
                price
                selectedOptions {
                  name
                  value
                }
                image {
                  transformedSrc(maxHeight: 500)
                }
              }
            }
          }
          updatedAt
          createdAt
        }
      }
    `;

    const campaign = campaigns.rows.find((row) => {
      const targets = row.targets;
      return (
        (targets.page === target &&
          targets.products.length > 0 &&
          targets.products.some((targetProduct) =>
            products.includes(parseInt(targetProduct.legacyResourceId, 10))
          )) ||
        (targets.page === target &&
          targets.collections.length > 0 &&
          targets.collections.some((targetCollection) => {
            return products.map(async (product) => {
              const productID = `gid://shopify/Product/${product}`;
              try {
                const response = await client.query({
                  query: PRODUCT_IN_COLLECTION,
                  variables: {
                    product: productID,
                    collection: targetCollection.id,
                  },
                });
                if (response.data) {
                  return response.data.inCollection;
                } else {
                  return false;
                }
              } catch (error) {
                console.log(
                  `Failed to check if the product ${product} is in collection ${targetCollection.title}(${targetCollection.id}) for store ${shop}`
                );
                console.error(error);
                return false;
              }
            });
          })) ||
        (targets.collections.length === 0 &&
          targets.products.length === 0 &&
          targets.page === target)
      );
    });

    if (campaign) {
      if (campaign.selling.mode === 'auto') {
        const filteredRecommendations = recommendations.filter(
          (recommendation) =>
            !campaign.selling.excludeProducts.find(
              (excludedProduct) =>
                excludedProduct.legacyResourceId ===
                recommendation.id.toString()
            )
        );
        campaign.selling.products = await Promise.all(
          filteredRecommendations.map(async (recommendation) => {
            const { price, id } = recommendation;
            if (
              price / 100 > parseFloat(campaign.strategy.maxItemValue) &&
              campaign.strategy.maxItemValue !== '0'
            ) {
              return false;
            } else {
              try {
                const response = await client.query({
                  query: GET_PRODUCT,
                  variables: {
                    id: `gid://shopify/Product/${id}`,
                  },
                });
                return {
                  ...response.data.product,
                  strategy: campaign.strategy,
                };
              } catch (error) {
                console.log(
                  `Failed to fetch product with id ${id} for store ${shop} during get-matching recommendation fetching.`
                );
                console.error(error);
                return false;
              }
            }
          })
        );
        if (campaign.strategy.maxNumberOfItems !== '0') {
          campaign.selling.products = campaign.selling.products.slice(
            0,
            parseInt(campaign.strategy.maxNumberOfItems, 10)
          );
        }
      } else {
        // TODO: just update if product is outdated
        campaign.selling.products = await Promise.all(
          campaign.selling.products.map(async (product) => {
            const { id, title } = product;
            try {
              const response = await client.query({
                query: GET_PRODUCT,
                variables: {
                  id,
                },
              });
              return { ...response.data.product, ...product };
            } catch (error) {
              console.log(
                `Failed to fetch product ${title} with id ${id} for store ${shop} during get-matching update.`
              );
              console.error(error);
              return false;
            }
          })
        );
      }
      campaign.selling.products = campaign.selling.products.filter(
        (product) => {
          const maxOrderValue = parseFloat(product.strategy.maxOrderValue);
          const minOrderValue = parseFloat(product.strategy.minOrderValue);
          const comparePrice = parseFloat(totalPrice);
          if (
            (maxOrderValue !== 0 || minOrderValue !== 0) &&
            !isNaN(comparePrice)
          ) {
            if (maxOrderValue === 0) {
              return comparePrice >= minOrderValue;
            } else {
              return (
                comparePrice >= minOrderValue && comparePrice <= maxOrderValue
              );
            }
          } else {
            return true;
          }
        }
      );
      if (campaign.selling.products.length === 0) {
        ctx.status = 404;
      } else {
        const { customJS, id, strategy, selling, options } = campaign;
        const html = await ReactDOMServer.renderToStaticMarkup(
          <AppProvider i18n={translations}>
            <Popup campaign={campaign} />
          </AppProvider>
        );
        ctx.body = {
          html,
          js: customElement(customJS),
          campaign: {
            id,
            strategy,
            selling,
            options,
            entry: campaign.targets.entry,
            products: campaign.targets.products,
          },
        };
        ctx.status = 200;
      }
    } else {
      ctx.status = 404;
    }
  });

  router.post('/api/create-draft-order', async (ctx) => {
    try {
      const {
        variantId,
        strategy,
        quantity,
        cart,
        shop,
        id,
        products,
      } = ctx.request.body;
      const store = await db.query(
        `SELECT * FROM stores WHERE stores.domain = $1`,
        [shop]
      );
      const accessToken = store.rows[0].access_token;
      const draftOrder = {
        line_items: cart.items.map((item) => ({ ...item, properties: [] })),
      };
      const { sellType, mode } = strategy;
      if (mode === 'discount') {
        const campaignItem = {
          variant_id: variantId,
          quantity,
          applied_discount: {
            value: strategy.discount.value,
            value_type:
              strategy.discount.type === '%' ? 'percentage' : 'fixed_amount',
          },
        };
        if (sellType === 'upsell') {
          draftOrder.line_items = draftOrder.line_items.filter(
            (lineItem) =>
              !products.find(
                (product) =>
                  product.legacyResourceId.toString() ===
                  lineItem.product_id.toString()
              )
          );
        }
        draftOrder.line_items = draftOrder.line_items.concat([campaignItem]);
        draftOrder.tags = 'Thunder Exit Upsell Funnel,discount';
      } else if (mode === 'free_shipping') {
        const campaignItem = {
          variant_id: variantId,
          quantity,
        };
        if (sellType === 'upsell') {
          draftOrder.line_items = draftOrder.line_items.filter(
            (lineItem) =>
              !products.find(
                (product) =>
                  product.legacyResourceId.toString() ===
                  lineItem.product_id.toString()
              )
          );
        }
        draftOrder.line_items = draftOrder.line_items.concat([campaignItem]);
        draftOrder.shipping_line = {
          price: 0.0,
          title: 'Free Shipping',
        };
        draftOrder.tags = 'Thunder Exit Upsell Funnel,free_shipping';
      } else if (mode === 'gift') {
        const campaignItem = {
          variant_id: variantId,
          quantity,
          applied_discount: {
            value: '100',
            value_type: 'percentage',
          },
        };
        draftOrder.line_items = draftOrder.line_items.concat([campaignItem]);
        draftOrder.tags = 'Thunder Exit Upsell Funnel,gift';
      }
      let order = await fetch(
        `https://${shop}/admin/api/2021-01/draft_orders.json`,
        {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': accessToken,
          },
          body: JSON.stringify({
            draft_order: draftOrder,
          }),
        }
      );
      order = await order.json();
      if (order && order.draft_order) {
        const addedVariantItem = order.draft_order.line_items.find(
          (lineItem) => lineItem.variant_id === parseInt(variantId, 10)
        );
        if (addedVariantItem) {
          const { price, applied_discount, quantity } = addedVariantItem;
          const variantPrice = parseFloat(price) * parseInt(quantity, 10);
          const addedValue = applied_discount.amount
            ? variantPrice - parseFloat(applied_discount.amount)
            : variantPrice;
          const { invoice_url, currency, total_price } = order.draft_order;
          await db.query(
            `INSERT INTO orders${db.insertColumns(
              'campaign_id',
              'domain',
              'draft_order_id',
              'currency',
              'value_added',
              'total_price'
            )}`,
            [id, shop, order.draft_order.id, currency, addedValue, total_price]
          );
          ctx.body = { invoiceUrl: invoice_url };
          ctx.status = 200;
        }
      } else {
        console.error(order);
        ctx.status = 500;
      }
    } catch (error) {
      ctx.status = 500;
      console.error(error);
    }
  });

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

  const createInsertQuery = (body) => {
    const columns = Object.keys(body).map((key) => `"${key}"`);
    const query = `INSERT INTO campaigns (${columns.join(
      ','
    )}) VALUES (${columns
      .map((_col, i) => `$${i + 1}`)
      .join(',')}) RETURNING *`;
    return query;
  };

  const getInsertValues = (campaign) =>
    Object.keys(campaign).map((key) => campaign[key]);

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
      const helperArray = getInsertValues(helper);
      const query = createInsertQuery(helper);
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

  router.post('/api/publish-campaign/:id', verifyRequest(), async (ctx) => {
    await db.query(
      'UPDATE campaigns SET published = true WHERE id = $1 AND domain = $2',
      [ctx.params.id, ctx.session.shop]
    );

    ctx.status = 200;
  });

  router.delete('/api/unpublish-campaign/:id', verifyRequest(), async (ctx) => {
    await db.query(
      'UPDATE campaigns SET published = false WHERE id = $1 AND domain = $2',
      [ctx.params.id, ctx.session.shop]
    );

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

  router.post('/api/campaigns', verifyRequest(), async (ctx) => {
    const campaigns = await db.query(
      'SELECT * FROM campaigns WHERE domain = $1',
      [ctx.session.shop]
    );
    ctx.body = campaigns.rows;
    ctx.status = 200;
  });

  router.post('/api/duplicate-campaign/:id', verifyRequest(), async (ctx) => {
    const existingCampaign = await db.query(
      'SELECT * FROM campaigns WHERE id = $1 AND domain = $2',
      [ctx.params.id, ctx.session.shop]
    );
    const duplicateCampaign = existingCampaign.rows[0];
    delete duplicateCampaign.id;
    duplicateCampaign.published = false;
    duplicateCampaign.name += ' copy';
    const insertQuery = createInsertQuery(duplicateCampaign);
    const inserValues = getInsertValues(duplicateCampaign);
    await db.query(insertQuery, [...inserValues]);
    const campaigns = await db.query(
      'SELECT * FROM campaigns WHERE domain = $1',
      [ctx.session.shop]
    );
    ctx.body = campaigns.rows;
    ctx.status = 200;
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
