import db from '../../db';

const campaignData = async (ctx) => {
  const campaign = await db.query('SELECT * FROM campaigns WHERE id = $1', [
    ctx.request.query.id,
  ]);
  let store = await db.query(
    'SELECT global_campaign_id FROM stores WHERE domain = $1',
    [ctx.state.session.shop]
  );
  store = store.rows[0];
  let globalCampaign = await db.query(
    'SELECT * FROM campaigns WHERE domain = $1 AND id = $2',
    [ctx.state.session.shop, store.global_campaign_id]
  );
  globalCampaign = globalCampaign.rows[0];
  if (globalCampaign) {
    const { styles, texts, customJS, customCSS, options } = globalCampaign;
    globalCampaign = { styles, texts, customJS, customCSS, options };
  }

  ctx.body = {
    campaign: campaign.rows[0],
    globalCampaign,
  };
};

export default campaignData;
