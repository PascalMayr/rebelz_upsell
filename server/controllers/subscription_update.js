import { config } from "dotenv/types";
import { mailTemplates } from "../handlers/mail";

const subscriptionUpdate = async (ctx) => {
  const shop = ctx.request.headers['x-shopify-shop-domain'];
  const {
    name,
    status,
    admin_graphql_api_id: subscriptionId,
  } = ctx.request.body.app_subscription;
  const storeData = await db.query('SELECT * FROM stores WHERE domain = $1', [
    shop,
  ]);
  const store = storeData.rows[0];
  const configPlan = config.plans.find((plan) => plan.name === name);
  const contact = await db.query(
    `SELECT email, first_name FROM users WHERE domain = $1 AND account_owner = TRUE`,
    [shop]
  );
  if (status === 'ACTIVE') {
    let subscriptionMailTemplate;
    if (storeData.plan_name === config.planNames.free) {
      subscriptionMailTemplate = mailTemplates.subscriptionCreated;
    } else {
      subscriptionMailTemplate = mailTemplates.subscriptionChanged;
    }
    await db.query(
      'UPDATE stores SET plan_name = $1, "subscriptionId" = $2, plan_limit = $3 WHERE domain = $4',
      [name, subscriptionId, configPlan.limit, shop]
    );
    await sendMail({
      to: contact.rows[0].email,
      template: subscriptionMailTemplate,
      templateData: {
        name: contact.rows[0].first_name,
      },
    });
  } else if (store.subscriptionId === subscriptionId) {
    const freePlan = config.plans.find(
      (plan) => plan.name === config.planNames.free
    );
    await db.query(
      'UPDATE stores SET plan_name = NULL, "subscriptionId" = NULL, plan_limit = $1 WHERE domain = $2',
      [freePlan.limit, shop]
    );
    await sendMail({
      to: contact.rows[0].email,
      template: mailTemplates.subscriptionCanceled,
      templateData: {
        name: contact.rows[0].first_name,
      },
    });
  }

  ctx.body = {};
  ctx.status = 200;
};

export default subscriptionUpdate;
