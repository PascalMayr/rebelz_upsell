--! Previous: sha1:9ceeed9e726f065aa4d227ebfaf939c51d9b26ad
--! Hash: sha1:0301d1d1949bb76b5efba41f3d443a962b730801

-- Enter migration here
ALTER TABLE views
DROP COLUMN IF EXISTS "counter" CASCADE,
DROP COLUMN IF EXISTS view_time CASCADE,
DROP COLUMN IF EXISTS view_date CASCADE,
DROP COLUMN IF EXISTS campaign_id CASCADE,
DROP COLUMN IF EXISTS domain CASCADE,
DROP COLUMN IF EXISTS target_page CASCADE,
ADD COLUMN campaign_id BIGINT,
ADD COLUMN domain VARCHAR(255),
ADD COLUMN target_page VARCHAR(255),
ADD COLUMN view_date DATE NOT NULL DEFAULT CURRENT_DATE,
ADD COLUMN counter BIGINT NOT NULL DEFAULT 1,
ADD CONSTRAINT campaign_domain_target_date UNIQUE (campaign_id, domain, target_page, view_date);
