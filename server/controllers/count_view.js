import db from '../db';
import sendMail, { mailTemplates } from '../handlers/mail';
import { firstDayOfCurrentBillingCycle } from '../utils/subscription';

const countView = async (ctx) => {
  const { id, shop, target } = ctx.request.body;
  await db.query(
    `INSERT INTO views ${db.insertColumns(
      'campaign_id',
      'domain',
      'target_page'
    )} ON CONFLICT ON CONSTRAINT campaign_domain_target_date DO UPDATE SET counter = views.counter + 1`,
    [id, shop, target]
  );
  let store = await db.query(
    `SELECT plan_limit, subscription_start FROM stores WHERE domain = $1`,
    [shop]
  );
  store = store.rows[0];
  const views = await db.query(
    `SELECT COUNT(*) FROM views WHERE domain = $1 AND view_date >= $2`,
    [
      shop,
      db.dateToSQL(
        firstDayOfCurrentBillingCycle(store.subscription_start).toJSDate()
      ),
    ]
  );
  const viewRatio = (views.rows[0].count * 100) / store.plan_limit;
  console.log('viewRatio', viewRatio);
  if (viewRatio === 80 || viewRatio === 100) {
    const contact = await db.query(
      `SELECT email, first_name FROM users WHERE domain = $1 AND account_owner = TRUE`,
      [shop]
    );
    const mailParams = {
      to: contact.rows[0].email,
      templateData: {
        name: contact.rows[0].first_name,
      },
    };
    if (viewRatio === 80) {
      await sendMail({
        ...mailParams,
        template: mailTemplates.planUsed80,
      });
    }
    if (viewRatio === 100) {
      await sendMail({
        ...mailParams,
        template: mailTemplates.planUsed100,
      });
    }
  }
  ctx.status = 200;
};

export default countView;
