import db from '../db';
import config from '../../config';
import sendMail, { mailTemplates } from '../handlers/mail';

const subscriptionUpdate = async (ctx) => {
  const shop = ctx.request.headers['x-shopify-shop-domain'];
  const {
    name,
    status,
    admin_graphql_api_id: subscriptionId,
    created_at: createdAt,
  } = ctx.request.body.app_subscription;

  let store = await db.query('SELECT plan_name FROM stores WHERE domain = $1', [
    shop,
  ]);
  store = store.rows[0];
  if (status === 'ACTIVE') {
    const configPlan = config.plans.find((plan) => plan.name === name);
    const contact = await db.query(
      `SELECT email, first_name FROM users WHERE domain = $1 AND account_owner = TRUE`,
      [shop]
    );
    let subscriptionMailTemplate;
    if (store.plan_name === config.planNames.free) {
      subscriptionMailTemplate = mailTemplates.subscriptionCreated;
    } else {
      subscriptionMailTemplate = mailTemplates.subscriptionChanged;
    }
    await db.query(
      'UPDATE stores SET plan_name = $1, "subscriptionId" = $2, plan_limit = $3, subscription_start = $4 WHERE domain = $5',
      [name, subscriptionId, configPlan.limit, createdAt, shop]
    );
    await sendMail({
      to: contact.rows[0].email,
      template: subscriptionMailTemplate,
      templateData: {
        name: contact.rows[0].first_name,
        subscription: configPlan.name,
      },
    });
  } else if (store.subscriptionId === subscriptionId) {
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
        subscription: store.plan_name,
      },
    });
  }

  ctx.body = {};
  ctx.status = 200;
};

export default subscriptionUpdate;
