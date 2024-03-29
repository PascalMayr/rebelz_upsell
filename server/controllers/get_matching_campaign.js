import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { AppProvider } from '@shopify/polaris';
import translations from '@shopify/polaris/locales/en.json';
import merge from 'lodash/merge';

import Popup from '../../components/popup';
import customElement from '../../components/popup/templates/debut/custom_element';
import db from '../db';
import { createClient } from '../handlers';
import GET_PRODUCT from '../handlers/queries/get_product';
import PRODUCT_IN_COLLECTION from '../handlers/queries/product_in_collection';
import { firstDayOfCurrentBillingCycle } from '../utils/subscription';

const getMatchingCampaign = async (ctx) => {
  const requestParams = ctx.request.body;

  let store = await db.query(
    `SELECT plan_limit, access_token, subscription_start FROM stores WHERE stores.domain = $1`,
    [requestParams.shop]
  );
  store = store.rows[0];
  const views = await db.query(
    'SELECT counter FROM views WHERE domain = $1 AND view_date >= $2',
    [
      requestParams.shop,
      db.dateToSQL(
        firstDayOfCurrentBillingCycle(store.subscription_start).toJSDate()
      ),
    ]
  );
  const viewsCount = views.rows
    .map((row) => parseInt(row.counter, 10))
    .reduce((sum, counter) => sum + counter, 0);

  if (viewsCount >= store.plan_limit) {
    ctx.status = 404;
    return;
  }

  let campaigns = await db.query(
    `SELECT *
    FROM campaigns
    INNER JOIN stores ON stores.domain = campaigns.domain
    WHERE campaigns.domain = $1
    AND stores.enabled = true
    AND campaigns.published = true
    AND campaigns.deleted IS NULL`,
    [requestParams.shop]
  );

  const client = await createClient(requestParams.shop, store.access_token);

  const getGQLProductId = (id) => `gid://shopify/Product/${id}`;

  campaigns = campaigns.rows.filter(
    (campaign) => campaign.targets.page === requestParams.target
  );

  const campaign = campaigns.find((row) => {
    const targets = row.targets;
    const matchesTargetProduct =
      targets.products.length > 0 &&
      targets.products.some((targetProduct) =>
        requestParams.products.includes(
          parseInt(targetProduct.legacyResourceId, 10)
        )
      );
    const matchesTargetCollection =
      targets.collections.length > 0 &&
      targets.collections.some((targetCollection) => {
        return requestParams.products.map(async (product) => {
          const productID = getGQLProductId(product);
          const response = await client.query({
            query: PRODUCT_IN_COLLECTION,
            variables: {
              product: productID,
              collection: targetCollection.id,
            },
          });
          ctx.assert(response.data);
          return response.data.inCollection;
        });
      });
    const matchesEverything =
      targets.collections.length === 0 && targets.products.length === 0;
    return matchesTargetProduct || matchesTargetCollection || matchesEverything;
  });

  if (campaign) {
    if (campaign.selling.mode === 'auto') {
      let filteredRecommendations = requestParams.recommendations.filter(
        (recommendation) =>
          !campaign.selling.excludeProducts.find(
            (excludedProduct) =>
              excludedProduct.legacyResourceId === recommendation.id.toString()
          )
      );
      const maxItemValue = parseFloat(campaign.strategy.maxItemValue);
      if (maxItemValue) {
        filteredRecommendations = filteredRecommendations.filter(
          (recommendation) => recommendation.price / 100 <= maxItemValue
        );
      }
      campaign.selling.products = await Promise.all(
        filteredRecommendations.map(async (recommendation) => {
          const response = await client.query({
            query: GET_PRODUCT,
            variables: {
              id: getGQLProductId(recommendation.id),
            },
          });
          ctx.assert(response.data && response.data.product);
          return {
            ...response.data.product,
            strategy: campaign.strategy,
          };
        })
      );
      const maxNumberOfItems = parseInt(campaign.strategy.maxNumberOfItems, 10);
      if (maxNumberOfItems) {
        campaign.selling.products = campaign.selling.products.slice(
          0,
          maxNumberOfItems
        );
      }
    } else {
      // TODO: just update if product is outdated
      campaign.selling.products = await Promise.all(
        campaign.selling.products.map(async (product) => {
          const response = await client.query({
            query: GET_PRODUCT,
            variables: {
              id: product.id,
            },
          });
          ctx.assert(response.data && response.data.product);
          return merge(product, response.data.product);
        })
      );
    }
    campaign.selling.products = campaign.selling.products.filter((product) => {
      const maxOrderValue = parseFloat(product.strategy.maxOrderValue);
      const minOrderValue = parseFloat(product.strategy.minOrderValue);
      const comparePrice = parseFloat(requestParams.totalPrice);
      if ((maxOrderValue > 0 || minOrderValue > 0) && !isNaN(comparePrice)) {
        if (maxOrderValue === 0) {
          return comparePrice >= minOrderValue;
        } else {
          return comparePrice >= minOrderValue && comparePrice <= maxOrderValue;
        }
      } else {
        return true;
      }
    });
    if (campaign.selling.products.length === 0) {
      ctx.status = 404;
    } else {
      const { customJS, id, strategy, selling, options, targets } = campaign;
      const html = await ReactDOMServer.renderToStaticMarkup(
        <AppProvider i18n={translations}>
          <Popup campaign={campaign} />
        </AppProvider>
      );
      ctx.body = {
        html,
        js: `${customElement()}${customJS}`,
        campaign: {
          id,
          strategy,
          targets,
          selling,
          options,
        },
      };
      ctx.status = 200;
    }
  } else {
    ctx.status = 404;
  }
};

export default getMatchingCampaign;
