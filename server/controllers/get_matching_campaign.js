import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { AppProvider } from '@shopify/polaris';
import translations from '@shopify/polaris/locales/en.json';
import { gql } from 'apollo-boost';

import Popup from '../../components/popup';
import customElement from '../../components/popup/templates/debut/custom_element';
import db from '../db';
import { createClient } from '../handlers';

import reportError from './report_error';

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

const getMatchingCampaign = async (ctx) => {
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
    parseInt(views.rows[0].count, 10) >= parseInt(store.rows[0].plan_limit, 10)
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
              const productInCollectionError = new Error(
                `Failed to check if the product ${product} is in collection ${targetCollection.title}(${targetCollection.id}) for store ${shop}`
              );
              reportError(productInCollectionError);
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
              excludedProduct.legacyResourceId === recommendation.id.toString()
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
              const fetchProducterror = new Error(
                `Failed to fetch product with id ${id} for store ${shop} during get-matching recommendation fetching.`
              );
              reportError(fetchProducterror);
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
            const fetchError = new Error(
              `Failed to fetch product ${title} with id ${id} for store ${shop} during get-matching update.`
            );
            reportError(fetchError);
            return false;
          }
        })
      );
    }
    campaign.selling.products = campaign.selling.products.filter((product) => {
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
          return comparePrice >= minOrderValue && comparePrice <= maxOrderValue;
        }
      } else {
        return true;
      }
    });
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
};

export default getMatchingCampaign;
