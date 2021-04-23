import db from '../db';

const publishCampaign = async (ctx) => {
  await db.query(
    'UPDATE campaigns SET published = true WHERE id = $1 AND domain = $2',
    [ctx.params.id, ctx.state.session.shop]
  );
  ctx.status = 200;
};

export default publishCampaign;
