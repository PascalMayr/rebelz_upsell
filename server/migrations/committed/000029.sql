--! Previous: sha1:82a270bc690df7255c4df379a8e18b3cf752204b
--! Hash: sha1:d4c39cac372fa4b632a4ce10b3553833b3257caf

-- Enter migration here
ALTER TABLE orders ADD COLUMN customer_id BIGINT;
