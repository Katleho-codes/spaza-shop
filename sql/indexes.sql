CREATE INDEX idx_stores_name ON stores(name);
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_stores_slug ON stores(slug);