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

const updateColumnsAndValues = (obj) => {
  const id = obj.id;
  delete obj.id;
  const values = Object.values(obj).concat([id]);

  const columns = Object.keys(obj)
    .map((key, index) => `"${key}" = $${index + 1}`)
    .join(', ');

  return [columns, values, values.length];
};

const dateToSQL = (date) => date.toISOString().split('T')[0];

const db = {
  query: (...args) => pool.query(...args),
  insertColumns,
  updateColumnsAndValues,
  dateToSQL,
};

export default db;
