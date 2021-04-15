--! Previous: sha1:b00e9a93fb6d09a8b1f38215bddb8485cad89fd3
--! Hash: sha1:9b907f3db5537915b1a94813b81d0543193fd9c7

-- Enter migration here
ALTER TABLE stores ADD COLUMN subscription_start TIMESTAMP DEFAULT current_timestamp NOT NULL;
