import db from '../db';

const toggleTrackingEnabled = async (ctx) => {
  await db.query(
    'UPDATE stores SET google_tracking_enabled = $1 WHERE domain = $2',
    [ctx.request.body.enabled, ctx.session.shop]
  );
  ctx.status = 200;
};

export default toggleTrackingEnabled;
