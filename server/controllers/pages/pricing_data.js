import db from '../../db';

const pricingData = async (ctx) => {
  let store = await db.query('SELECT plan_name FROM stores WHERE domain = $1', [
    ctx.state.session.shop,
  ]);
  store = store.rows[0];

  ctx.body = store.plan_name;
};

export default pricingData;
