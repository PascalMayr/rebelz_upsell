import { Pool } from 'pg';
import url from 'url';
import dotenv from 'dotenv';

dotenv.config();

const params = url.parse(process.env.DATABASE_URL);
const [user, password] = params.auth.split(':');
const pool = new Pool({
  user,
  password,
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1]
});

export default {
  query: (...args) => pool.query(...args)
}
