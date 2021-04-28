// https://github.com/Shopify/shopify-node-api/blob/main/docs/usage/customsessions.md

import db from '../db';

export const storeCallback = async (session) => {
  const queryResult = await db.query(
    `
    INSERT INTO sessions(id, data) VALUES($1, $2)
    ON CONFLICT (id)
    DO UPDATE SET data = $2;
    `,
    [session.id, session]
  );

  return Boolean(queryResult.rowCount);
};

export const loadCallback = async (sessionId) => {
  let session = await db.query(`SELECT * FROM sessions WHERE id = $1`, [
    sessionId,
  ]);
  session = session.rows[0];
  return session ? session.data : undefined;
};

export const deleteCallback = async (sessionId) => {
  const queryResult = await db.query('DELETE FROM sessions WHERE id = $1', [
    sessionId,
  ]);

  return Boolean(queryResult.rowCount);
};
