import db from '../db';
import {
  createClient,
  getSubscriptionUrl,
  cancelSubscription,
} from '../handlers';

import reportError from './report_error';

const manageSubscription = async (ctx) => {
  try {
    const { plan } = ctx.request.body;
    const { shop, accessToken } = ctx.session;
    const storeData = await db.query('SELECT * FROM stores WHERE domain = $1', [
      ctx.session.shop,
    ]);
    const store = storeData.rows[0];
    server.context.client = await createClient(shop, accessToken);

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
  } catch (error) {
    reportError(error);
  }
};

export default manageSubscription;
