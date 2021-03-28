import db from '../db';

import reportError from './report_error';

const getCampaigns = async (ctx) => {
  try {
    const campaigns = await db.query(
      'SELECT * FROM campaigns WHERE domain = $1',
      [ctx.session.shop]
    );
    ctx.body = campaigns.rows;
    ctx.status = 200;
  } catch (error) {
    reportError(error);
    ctx.status = 500;
  }
};

export default getCampaigns;
