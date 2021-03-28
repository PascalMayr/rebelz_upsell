import db from '../db';

const getCampaigns = async (ctx) => {
  const campaigns = await db.query(
    'SELECT * FROM campaigns WHERE domain = $1',
    [ctx.session.shop]
  );
  ctx.body = campaigns.rows;
  ctx.status = 200;
};

export default getCampaigns;
