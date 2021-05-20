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
  let store = await db.query('SELECT * FROM stores WHERE domain = $1', [shop]);
  store = store.rows[0];
  console.dir(store);
  console.dir(ctx.request.body.app_subscription)
  console.log(subscriptionId);
  console.log(status);
  const configPlan = config.plans.find((plan) => plan.name === name);
  const contact = await db.query(
    `SELECT email, first_name FROM users WHERE domain = $1 AND account_owner = TRUE`,
    [shop]
  );
  if (status === 'ACTIVE') {
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
    console.dir({
      to: contact.rows[0].email,
      template: subscriptionMailTemplate,
      templateData: {
        name: contact.rows[0].first_name,
        subscription: configPlan.name,
      },
    });
    await sendMail({
      to: contact.rows[0].email,
      template: subscriptionMailTemplate,
      templateData: {
        name: contact.rows[0].first_name,
        subscription: configPlan.name,
      },
    });
    console.log('after sendmail');
  } else if (store.subscriptionId === subscriptionId) {
    console.log('plan cancel accepted');
    const freePlan = config.plans.find(
      (plan) => plan.name === config.planNames.free
    );
    await db.query(
      'UPDATE stores SET plan_name = $1, "subscriptionId" = NULL, subscription_start = current_timestamp, plan_limit = $2 WHERE domain = $3',
      [freePlan.name, freePlan.limit, shop]
    );
    console.dir({
      to: contact.rows[0].email,
      template: mailTemplates.subscriptionCanceled,
      templateData: {
        name: contact.rows[0].first_name,
        subscription: configPlan.name,
      },
    });
    await sendMail({
      to: contact.rows[0].email,
      template: mailTemplates.subscriptionCanceled,
      templateData: {
        name: contact.rows[0].first_name,
        subscription: configPlan.name,
      },
    });
    console.log('after sendmail');
  }

  ctx.body = {};
  ctx.status = 200;
};

export default subscriptionUpdate;
