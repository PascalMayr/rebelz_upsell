import db from '../db';

const shopRedact = async (ctx) => {
  const shop = ctx.request.headers['x-shopify-shop-domain'];
  await db.query('DELETE FROM orders WHERE domain = $1', [shop]);
  ctx.body = {};
  ctx.status = 200;
};

export default shopRedact;
