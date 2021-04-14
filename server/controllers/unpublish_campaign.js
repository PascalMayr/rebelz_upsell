import db from '../db';

const unpublishCampaign = async (ctx) => {
  await db.query(
    'UPDATE campaigns SET published = false WHERE id = $1 AND domain = $2',
    [ctx.params.id, ctx.session.shop]
  );
  ctx.status = 200;
};

export default unpublishCampaign;
