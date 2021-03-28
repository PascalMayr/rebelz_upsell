import db from '../db';

const countView = async (ctx) => {
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
};

export default countView;
