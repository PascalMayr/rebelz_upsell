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
    const freePlan = config.plans.find(
      (configPlan) => configPlan.name === config.planNames.free
    );
    await db.query(
      'UPDATE stores SET plan_name = $1, "subscriptionId" = NULL, plan_limit = $2 WHERE domain = $3',
      [freePlan.name, freePlan.limit, shop]
    );
    const contact = await db.query(
      `SELECT email, first_name FROM users WHERE domain = $1 AND account_owner = TRUE`,
      [shop]
    );
    await sendMail({
      to: contact.rows[0].email,
      template: mailTemplates.subscriptionCanceled,
      templateData: {
        name: contact.rows[0].first_name,
        subscription: freePlan.name,
      },
    });

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
