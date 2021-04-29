import db from '../db';

const appUninstalled = async (ctx) => {
  const shop = ctx.request.headers['x-shopify-shop-domain'];
  await db.query('UPDATE stores SET enabled = false WHERE domain = $1', [shop]);

  ctx.body = {};
  ctx.status = 200;
};

export default appUninstalled;
