--! Previous: -
--! Hash: sha1:7f1045ea049625650dd7b67a522e5f5797544a08

-- Enter migration here
DROP TABLE IF EXISTS stores;

CREATE TABLE stores (
  domain VARCHAR(255) PRIMARY KEY
);
