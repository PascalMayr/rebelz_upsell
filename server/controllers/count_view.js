import db from '../db';

import reportError from './report_error';

const countView = async (ctx) => {
  try {
    const { id, shop, target } = ctx.request.body;
    await db.query(
      `INSERT INTO views${db.insertColumns(
        'campaign_id',
        'domain',
        'target_page'
      )}`,
      [id, shop, target]
    );
    ctx.status = 200;
  } catch (error) {
    reportError(error);
    ctx.status = 500;
  }
};

export default countView;
