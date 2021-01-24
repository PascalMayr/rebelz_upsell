import url from 'url';

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const params = url.parse(process.env.DATABASE_URL);
const [user, password] = params.auth.split(':');
const pool = new Pool({
  user,
  password,
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
});

const insertColumns = (...cols) => {
  const columns = cols.join(',');
  const dollarValues = cols.map((_col, i) => `$${i + 1}`).join(',');
  return `(${columns}) VALUES(${dollarValues})`;
};

const db = {
  query: (...args) => pool.query(...args),
  insertColumns,
};

export default db;
