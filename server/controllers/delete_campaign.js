import db from '../db';

const deleteCampaign = async (ctx) => {
  await db.query(
    'UPDATE campaigns SET deleted = CURRENT_TIMESTAMP WHERE id = $1 AND domain = $2',
    [ctx.params.id, ctx.session.shop]
  );
  ctx.status = 200;
};

export default deleteCampaign;
