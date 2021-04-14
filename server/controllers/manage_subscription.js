import db from '../db';
import {
  createClient,
  getSubscriptionUrl,
  cancelSubscription,
} from '../handlers';
import config from '../../config';

const manageSubscription = async (ctx) => {
  const { plan } = ctx.request.body;
  const { shop, accessToken } = ctx.session;
  let store = await db.query('SELECT * FROM stores WHERE domain = $1', [
    ctx.session.shop,
  ]);
  store = store.rows[0];
  ctx.client = await createClient(shop, accessToken);

  if (store.plan_name === plan) {
    await cancelSubscription(ctx, store.subscriptionId);
    const freePlan = config.plans.find(
      (configPlan) => configPlan.name === config.planNames.free
    );
    await db.query(
      'UPDATE stores SET plan_name = NULL, "subscriptionId" = NULL, plan_limit = $1 WHERE domain = $2',
      [freePlan.limit, ctx.session.shop]
    );

    ctx.body = {};
    ctx.status = 200;
  } else {
    const currentPlan = config.plans.find(
      (configPlan) => configPlan.name === plan
    );
    const { confirmationUrl } = await getSubscriptionUrl(ctx, currentPlan);

    ctx.body = { confirmationUrl };
  }
};

export default manageSubscription;
