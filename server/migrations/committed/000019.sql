--! Previous: sha1:093e14e714dd3b3d8a828272d62f5e91c6e434a7
--! Hash: sha1:edfd07e1a2fa2f8e06d08197b4fe70be52a2a801

-- Enter migration here
DROP TABLE IF EXISTS views;

CREATE TABLE views(
  view_time TIMESTAMP DEFAULT current_timestamp NOT NULL,
  campaign_id BIGINT NOT NULL,
  domain VARCHAR(255) NOT NULL,
  target_page VARCHAR(255) NOT NULL
);
