import db from '../db';
import sendMail, { mailTemplates } from '../handlers/mail';
import GET_ORDER from '../handlers/queries/get_order';

const draftOrdersUpdate = async (ctx) => {
  const shop = ctx.request.headers['x-shopify-shop-domain'];
  console.log('draftOrdersUpdate');
  console.dir(ctx.request.body);
  const { id, status, customer, order_id } = ctx.request.body;
  const completedStatus = 'completed';

  let completedOrderCount = await db.query(
    'SELECT COUNT(*) FROM orders WHERE domain = $1 AND status = $2;',
    [shop, completedStatus]
  );
  completedOrderCount = completedOrderCount.rows[0].count;

  if (status === completedStatus) {
    console.log('order is completed');
    let customer_id;
    let store = await db.query(
      `SELECT access_token FROM stores WHERE domain = $1`,
      [shop]
    );
    store = store.rows[0];
    console.dir(store);
    const client = await createClient(shop, store.access_token);
    const response = await client.query({
      query: GET_ORDER,
      variables: {
        id: order_id,
      },
    });
    ctx.assert(response.data);
    console.dir(response.data);
    customer_id = response.data.customer.legacyResourceId;

    await db.query(
      'UPDATE orders SET status = $1, customer_id = $2 WHERE domain = $3 AND id = $4',
      [status, customer_id, shop, id]
    );

    if (completedOrderCount === 0) {
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
  }

  ctx.body = {};
  ctx.status = 200;
};

export default draftOrdersUpdate;
