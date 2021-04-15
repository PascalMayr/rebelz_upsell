--! Previous: sha1:9b907f3db5537915b1a94813b81d0543193fd9c7
--! Hash: sha1:82a270bc690df7255c4df379a8e18b3cf752204b

-- Enter migration here
CREATE INDEX IF NOT EXISTS idx_views_domain_view_date ON views(domain, view_date)
