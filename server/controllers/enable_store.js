import db from '../db';

const enableStore = async (ctx) => {
  await db.query('UPDATE stores SET enabled = $1 WHERE domain = $2', [
    ctx.request.body.enabled,
    ctx.state.session.shop,
  ]);
  ctx.status = 200;
};

export default enableStore;
