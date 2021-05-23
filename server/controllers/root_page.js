import db from '../db';

const rootPage = async (ctx) => {
  const shop = ctx.query.shop;
  let store = await db.query(
    'SELECT domain FROM stores WHERE domain = $1 AND access_token IS NOT NULL',
    [shop]
  );
  store = store.rows[0];
  if (store) {
    ctx.redirect(`/auth?shop=${shop}`);
  } else {
    ctx.redirect(`/offline/auth?shop=${shop}`);
  }
};

export default rootPage;
