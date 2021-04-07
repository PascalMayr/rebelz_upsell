-- Enter migration here
ALTER TABLE campaigns
ALTER COLUMN "created" TYPE timestamp with time zone,
ALTER COLUMN "updated" TYPE timestamp with time zone,
ALTER COLUMN "deleted" TYPE timestamp with time zone;
