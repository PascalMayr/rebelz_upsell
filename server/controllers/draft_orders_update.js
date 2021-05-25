import Shopify from '@shopify/shopify-api';

import db from '../db';
import sendMail, { mailTemplates } from '../handlers/mail';

const draftOrdersUpdate = async (ctx) => {
  const shop = ctx.request.headers['x-shopify-shop-domain'];
  const { id, status, order_id: orderId } = ctx.request.body;
  const completedStatus = 'completed';

  let completedOrderCount = await db.query(
    'SELECT COUNT(*) FROM orders WHERE domain = $1 AND status = $2;',
    [shop, completedStatus]
  );
  console.dir(completedOrderCount);
  completedOrderCount = completedOrderCount.rows[0].count;

  if (status === completedStatus) {
    let store = await db.query(
      `SELECT access_token FROM stores WHERE domain = $1`,
      [shop]
    );
    store = store.rows[0];
    const client = new Shopify.Clients.Rest(shop, store.access_token);
    const orderData = await client.get({
      path: `orders/${orderId}`,
    });

    await db.query(
      'UPDATE orders SET status = $1, customer_id = $2 WHERE domain = $3 AND draft_order_id = $4',
      [status, orderData.body.order.customer.id, shop, id]
    );

    if (completedOrderCount === 0) {
      console.log('if completed order count 0');
      const contact = await db.query(
        `SELECT email, first_name FROM users WHERE domain = $1 AND account_owner = TRUE`,
        [shop]
      );
      console.dir({
        to: contact.rows[0].email,
        template: mailTemplates.firstSale,
        templateData: {
          name: contact.rows[0].first_name,
        },
      });
      await sendMail({
        to: contact.rows[0].email,
        template: mailTemplates.firstSale,
        templateData: {
          name: contact.rows[0].first_name,
        },
      });
    }
  }

  ctx.body = {};
  ctx.status = 200;
};

export default draftOrdersUpdate;
