import db from '../db';

const createInsertQuery = (body) => {
  const columns = Object.keys(body).map((key) => `"${key}"`);
  const query = `INSERT INTO campaigns (${columns.join(
    ','
  )}) VALUES (${columns.map((_col, i) => `$${i + 1}`).join(',')}) RETURNING *`;
  return query;
};

const getInsertValues = (campaign) =>
  Object.keys(campaign).map((key) => campaign[key]);

const saveCampaign = async (ctx) => {
  const requestBody = ctx.request.body;

  let campaign;

  const createUpdateArray = (body) => {
    const id = body.id;
    delete body.id;
    return Object.keys(body)
      .map((key) => body[key])
      .concat([id]);
  };

  const createUpdateQuery = (body) => {
    const keysArray = Object.keys(body);
    const query = `Update campaigns SET ${keysArray
      .map((key, index) => `"${key}" = $${index + 1}`)
      .join(', ')} WHERE id = $${keysArray.length + 1} RETURNING *`;
    return query;
  };

  if (requestBody.id) {
    const updateValues = createUpdateArray(requestBody);
    campaign = await db.query(createUpdateQuery(requestBody), updateValues);
  } else {
    const helper = requestBody;
    helper.domain = ctx.session.shop;
    const helperArray = getInsertValues(helper);
    const query = createInsertQuery(helper);
    campaign = await db.query(query, [...helperArray]);
  }
  ctx.body = campaign.rows[0];
  ctx.status = 200;
};

export default saveCampaign;
