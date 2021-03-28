import db from '../db';

import reportError from './report_error';

const deleteCampaign = async (ctx) => {
  try {
    await db.query('DELETE FROM campaigns WHERE id = $1 AND domain = $2', [
      ctx.params.id,
      ctx.session.shop,
    ]);
    ctx.status = 200;
  } catch (error) {
    reportError(error);
    ctx.status = 500;
  }
};

export default deleteCampaign;
