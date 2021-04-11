--! Previous: sha1:a436e601c53a451e9185649aa896d64792817e98
--! Hash: sha1:de1f4b6ae8ddcfd92b09f603686b9c3d7fbfedc3

-- Enter migration here
ALTER TABLE orders ADD PRIMARY KEY(draft_order_id);

CREATE INDEX IF NOT EXISTS idx_orders_domain ON orders(domain)
