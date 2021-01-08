--! Previous: sha1:2f19c5bedc295d79f0aa3b0c50064cad986fc75a
--! Hash: sha1:c952566ac5bec7b386557f68d31872a3eaba8af5

-- Enter migration here
CREATE INDEX IF NOT EXISTS idx_campaigns_domain ON campaigns(domain)
