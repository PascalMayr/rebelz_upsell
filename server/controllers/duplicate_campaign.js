import db from '../db';

import reportError from './report_error';

const createInsertQuery = (body) => {
  const columns = Object.keys(body).map((key) => `"${key}"`);
  const query = `INSERT INTO campaigns (${columns.join(
    ','
  )}) VALUES (${columns.map((_col, i) => `$${i + 1}`).join(',')}) RETURNING *`;
  return query;
};

const getInsertValues = (campaign) =>
  Object.keys(campaign).map((key) => campaign[key]);

const duplicateCampaign = async (ctx) => {
  try {
    const existingCampaign = await db.query(
      'SELECT * FROM campaigns WHERE id = $1 AND domain = $2',
      [ctx.params.id, ctx.session.shop]
    );
    const duplicatedCampaign = existingCampaign.rows[0];
    delete duplicatedCampaign.id;
    duplicatedCampaign.published = false;
    duplicatedCampaign.name += ' copy';
    const insertQuery = createInsertQuery(duplicatedCampaign);
    const inserValues = getInsertValues(duplicatedCampaign);
    await db.query(insertQuery, [...inserValues]);
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

export default duplicateCampaign;
