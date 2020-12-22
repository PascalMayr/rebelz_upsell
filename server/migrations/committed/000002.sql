--! Previous: sha1:7f1045ea049625650dd7b67a522e5f5797544a08
--! Hash: sha1:1dc06acdcf3022c8cbdd66b28ac35461cd128e4e

-- Enter migration here
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  domain VARCHAR(255) NOT NULL,
  associated_user_scope TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email CITEXT NOT NULL,
  account_owner BOOLEAN NOT NULL,
  locale VARCHAR(255) NOT NULL,
  CONSTRAINT fk_store FOREIGN KEY(domain) REFERENCES stores(domain)
);
