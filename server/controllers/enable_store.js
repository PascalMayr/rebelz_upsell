import db from '../db';

import reportError from './report_error';

const enableStore = async (ctx) => {
  try {
    await db.query('UPDATE stores SET enabled = $1 WHERE domain = $2', [
      ctx.request.body.enabled,
      ctx.session.shop,
    ]);
    ctx.status = 200;
  } catch (error) {
    reportError(error);
  }
};

export default enableStore;
