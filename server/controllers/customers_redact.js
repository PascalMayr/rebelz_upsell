import db from '../db';

const customerRedact = async (ctx) => {
  const shop = ctx.request.headers['x-shopify-shop-domain'];
  await db.query('DELETE FROM orders WHERE domain = $1 AND customer_id = $2', [
    shop,
    ctx.request.body.customer.id,
  ]);
  ctx.body = {};
  ctx.status = 200;
};

export default customerRedact;
