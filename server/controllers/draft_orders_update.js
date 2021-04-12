import db from '../db';
import sendMail, { mailTemplates } from '../handlers/mail';

const draftOrdersUpdate = async (ctx) => {
  const shop = ctx.request.headers['x-shopify-shop-domain'];
  const { id, status } = ctx.request.body.draft_order;
  const completedStatus = 'completed';

  let completedOrderCount = await db.query(
    'SELECT COUNT(*) FROM orders WHERE domain = $1 AND status = $2;',
    [shop, completedStatus]
  );
  completedOrderCount = completedOrderCount.rows[0].count;

  await db.query(
    'UPDATE orders SET status = $1 WHERE domain = $2 AND id = $3',
    [status, shop, id]
  );

  if (completedOrderCount === 0 && status === completedStatus) {
    const contact = await db.query(
      `SELECT email, first_name FROM users WHERE domain = $1 AND account_owner = TRUE`,
      [shop]
    );
    await sendMail({
      to: contact.rows[0].email,
      template: mailTemplates.firstSale,
      templateData: {
        name: contact.rows[0].first_name,
      },
    });
  }

  ctx.body = {};
  ctx.status = 200;
};

export default draftOrdersUpdate;
