import db from '../db';

const duplicateCampaign = async (ctx) => {
  const existingCampaign = await db.query(
    'SELECT * FROM campaigns WHERE id = $1 AND domain = $2',
    [ctx.params.id, ctx.session.shop]
  );
  const duplicatedCampaign = existingCampaign.rows[0];
  delete duplicatedCampaign.id;
  duplicatedCampaign.created = new Date();
  duplicatedCampaign.updated = duplicatedCampaign.created;
  duplicatedCampaign.deleted = null;
  duplicatedCampaign.published = false;
  duplicatedCampaign.name += ' copy';
  const columns = Object.keys(duplicatedCampaign).map((key) => `"${key}"`);
  const insertValues = Object.keys(duplicatedCampaign).map(
    (key) => duplicatedCampaign[key]
  );
  const campaign = await db.query(
    `INSERT INTO campaigns ${db.insertColumns(...columns)} RETURNING *`,
    [...insertValues]
  );
  ctx.body = campaign.rows[0];
  ctx.status = 200;
};

export default duplicateCampaign;
