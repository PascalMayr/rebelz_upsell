import db from '../db';
import sendMail, { mailTemplates } from '../handlers/mail';

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
  let views = await db.query(
    `SELECT COUNT(*) FROM views WHERE domain = $1 AND date_part('month', views.view_date) = date_part('month', (SELECT current_timestamp))`,
    [shop]
  );
  views = views.rows[0].count;
  let limit = await db.query(
    `SELECT plan_limit FROM stores WHERE domain = $1`,
    [shop]
  );
  limit = limit.rows[0].plan_limit;
  const viewRatio = (views * 100) / limit;
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
