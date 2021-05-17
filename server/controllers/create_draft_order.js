/* eslint-disable babel/camelcase */
import db from '../db';
import restClient from '../handlers/restClient';

const createDraftOrder = async (ctx) => {
  const {
    variantId,
    strategy,
    quantity,
    cart,
    shop,
    id,
    products,
  } = ctx.request.body;
  const { sellType, mode } = strategy;
  const store = await db.query(
    `SELECT * FROM stores WHERE stores.domain = $1`,
    [shop]
  );
  const accessToken = store.rows[0].access_token;
  const draftOrder = {
    line_items: cart.items.map((item) => ({ ...item, properties: [] })),
  };
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
    draftOrder.tags = 'Rebelz Exit Intent Upsells,discount';
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
    draftOrder.tags = 'Rebelz Exit Intent Upsells,free_shipping';
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
    draftOrder.tags = 'Rebelz Exit Intent Upsells,gift';
  }
  let order = await restClient(shop, 'draft_orders', accessToken, {
    method: 'POST',
    body: JSON.stringify({
      draft_order: draftOrder,
    }),
  });
  order = await order.json();
  if (order.draft_order) {
    const addedVariantItem = order.draft_order.line_items.find(
      (lineItem) => lineItem.variant_id === parseInt(variantId, 10)
    );
    if (addedVariantItem) {
      const { price, applied_discount, quantity } = addedVariantItem;
      const variantPrice = parseFloat(price) * parseInt(quantity, 10);
      const addedValue = applied_discount && applied_discount.amount
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
    ctx.status = 500;
    throw new Error(`Failed to create an order for ${shop}.`);
  }
};

export default createDraftOrder;
