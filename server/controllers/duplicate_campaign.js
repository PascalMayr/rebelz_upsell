import db from '../db';

const duplicateCampaign = async (ctx) => {
  const existingCampaign = await db.query(
    'SELECT * FROM campaigns WHERE id = $1 AND domain = $2',
    [ctx.params.id, ctx.session.shop]
  );
  const duplicatedCampaign = existingCampaign.rows[0];
  delete duplicatedCampaign.id;
  duplicatedCampaign.published = false;
  duplicatedCampaign.name += ' copy';
  const columns = Object.keys(duplicatedCampaign).map((key) => `"${key}"`);
  const insertValues = Object.keys(duplicatedCampaign).map(
    (key) => duplicatedCampaign[key]
  );
  await db.query(`INSERT INTO campaigns ${db.insertColumns(...columns)}`, [
    ...insertValues,
  ]);
  let campaigns = await db.query('SELECT * FROM campaigns WHERE domain = $1', [
    ctx.session.shop,
  ]);
  campaigns = await Promise.all(
    campaigns.rows.map(async (campaign) => {
      const views = await db.query(
        `SELECT counter FROM views WHERE domain = $1 AND campaign_id = $2 AND date_part('month', views.view_date) = date_part('month', (SELECT current_date))`,
        [ctx.session.shop, campaign.id]
      );
      let viewsCount = 0;
      if (views.rows.length > 0) {
        viewsCount = views.rows
          .map((row) => (row.counter ? parseInt(row.counter, 10) : 0))
          .reduce((sum, counter) => sum + counter);
      }
      return {
        ...campaign,
        views: viewsCount,
        sales: 0,
        revenue: 0,
      };
    })
  );
  ctx.body = campaigns;
  ctx.status = 200;
};

export default duplicateCampaign;
