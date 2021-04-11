import db from '../db';
import sendMail from '../handlers/mail';

const countView = async (ctx) => {
  try {
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
      `SELECT COUNT(*) FROM views WHERE domain = $1 AND date_part('month', views.view_time) = date_part('month', (SELECT current_timestamp))`,
      [shop]
    );
    let limit = await db.query(
      `SELECT plan_limit FROM stores WHERE domain = $1`,
      [shop]
    );
    const contact = await db.query(
      `SELECT email, first_name FROM users WHERE domain = $1 AND account_owner = TRUE`,
      [shop]
    );
    views = views.rows[0].count;
    limit = limit.rows[0].plan_limit;
    const email = contact.rows[0].email;
    const name = contact.rows[0].first_name;
    if (isNaN(views) && isNaN(limit)) {
      if ((views * 100) / limit === 80) {
        await sendMail(
          {
            to: email,
          },
          'planUsed80',
          {
            name,
          }
        );
      }
      if ((views * 100) / limit === 100) {
        await sendMail(
          {
            to: email,
          },
          'planUsed100',
          {
            name,
          }
        );
      }
    }
    ctx.status = 200;
  } catch (error) {
    reportError(error);
    ctx.status = 500;
  }
};

export default countView;
