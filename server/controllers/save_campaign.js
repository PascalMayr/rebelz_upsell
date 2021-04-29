import db from '../db';

const saveCampaign = async (ctx) => {
  const requestBody = ctx.request.body;
  const requestQueryParams = ctx.request.query;

  let campaign;

  if (requestBody.id) {
    delete requestBody.updated;
    const [
      updateColumns,
      updateValues,
      updateIdIndex,
    ] = db.updateColumnsAndValues(requestBody);
    campaign = await db.query(
      `UPDATE campaigns SET ${updateColumns}, updated = CURRENT_TIMESTAMP WHERE id = $${updateIdIndex} RETURNING *`,
      updateValues
    );
  } else {
    requestBody.domain = ctx.state.session.shop;
    const columns = Object.keys(requestBody).map((key) => `"${key}"`);
    campaign = await db.query(
      `INSERT INTO campaigns${db.insertColumns(...columns)} RETURNING *`,
      [...Object.values(requestBody)]
    );
    if (requestQueryParams.global) {
      await db.query(
        `UPDATE stores SET global_campaign_id = $1 WHERE domain = $2`,
        [campaign.rows[0].id, ctx.state.session.shop]
      );
    }
  }
  ctx.body = campaign.rows[0];
  ctx.status = 200;
};

export default saveCampaign;
