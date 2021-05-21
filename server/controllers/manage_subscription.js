import db from '../db';
import {
  createClient,
  getSubscriptionUrl,
  cancelSubscription,
} from '../handlers';
import config from '../../config';
import sendMail, { mailTemplates } from '../handlers/mail';

const manageSubscription = async (ctx) => {
  const { plan } = ctx.request.body;
  const { shop, accessToken } = ctx.state.session;
  let store = await db.query('SELECT * FROM stores WHERE domain = $1', [shop]);
  store = store.rows[0];
  ctx.client = await createClient(shop, accessToken);

  if (store.plan_name === plan) {
    await cancelSubscription(ctx, store.subscriptionId);

    ctx.body = {};
    ctx.status = 200;
  } else {
    const currentPlan = config.plans.find(
      (configPlan) => configPlan.name === plan
    );
    const { confirmationUrl } = await getSubscriptionUrl(ctx, currentPlan, shop);

    ctx.body = { confirmationUrl };
  }
};

export default manageSubscription;
