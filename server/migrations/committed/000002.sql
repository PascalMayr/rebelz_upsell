--! Previous: sha1:7f1045ea049625650dd7b67a522e5f5797544a08
--! Hash: sha1:f57e179dfb4abbd59c77b2eadcf1c44beeca88b9

-- Enter migration here
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  domain VARCHAR(255) REFERENCES stores(domain),
  associated_user_scope TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email CITEXT NOT NULL,
  account_owner BOOLEAN NOT NULL,
  locale VARCHAR(255) NOT NULL
);
