-- Enter migration here
DROP TABLE IF EXISTS views;

CREATE TABLE views(
  view_time TIMESTAMP DEFAULT current_timestamp NOT NULL,
  campaign_id BIGINT NOT NULL,
  domain VARCHAR(255) NOT NULL,
  target_page VARCHAR(255) NOT NULL
);