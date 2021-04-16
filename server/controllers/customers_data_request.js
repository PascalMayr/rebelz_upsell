import db from '../db';
import sendMail, { mailTemplates } from '../handlers/mail';

const customerDataRequest = async (ctx) => {
  const shop = ctx.request.headers['x-shopify-shop-domain'];
  const customer = ctx.request.body.customer;
  let customerOrders = await db.query(
    'SELECT * FROM orders WHERE domain = $1 AND customer_id = $2',
    [shop, customer.id]
  );
  customerOrders = customerOrders.rows;
  const contact = await db.query(
    `SELECT email, first_name FROM users WHERE domain = $1 AND account_owner = TRUE`,
    [shop]
  );
  await sendMail({
    to: contact.rows[0].email,
    template: mailTemplates.customersDataRequest,
    templateData: {
      customerOrders,
      customerId: customer.id,
      dataRequestId: ctx.request.body.data_request.id,
      customerEmail: customer.email,
      name: contact.rows[0].first_name,
    },
  });
  ctx.body = {};
  ctx.status = 200;
};

export default customerDataRequest;
