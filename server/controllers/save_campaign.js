import db from '../db';

const saveCampaign = async (ctx) => {
  const requestBody = ctx.request.body;

  let campaign;

  if (requestBody.id) {
    const [
      updateColumns,
      updateValues,
      updateIdIndex,
    ] = db.updateColumnsAndValues(requestBody);
    campaign = await db.query(
      `UPDATE campaigns SET ${updateColumns} WHERE id = $${updateIdIndex} RETURNING *`,
      updateValues
    );
  } else {
    requestBody.domain = ctx.session.shop;
    const columns = Object.keys(requestBody).map((key) => `"${key}"`);
    campaign = await db.query(
      `INSERT INTO campaigns ${db.insertColumns(...columns)}`,
      [...Object.values(requestBody)]
    );
  }
  ctx.body = campaign.rows[0];
  ctx.status = 200;
};

export default saveCampaign;
