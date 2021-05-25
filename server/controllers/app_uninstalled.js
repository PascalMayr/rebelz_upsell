import db from '../db';
import config from '../../config';

const appUninstalled = async (ctx) => {
  const shop = ctx.request.headers['x-shopify-shop-domain'];
  const freePlan = config.plans.find(
    (configPlan) => configPlan.name === config.planNames.free
  );
  await db.query(
    'UPDATE stores SET enabled = false, plan_name = $1, "subscriptionId" = NULL, access_token = NULL, plan_limit = $2 WHERE domain = $3',
    [freePlan.name, freePlan.limit, shop]
  );

  ctx.body = {};
  ctx.status = 200;
};

export default appUninstalled;
