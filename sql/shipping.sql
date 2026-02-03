create table shipping (
    id bigserial primary key,
    created_at timestamp,
    updated_at timestamp,
    order_id integer references orders(id),
    product_id integer references products(id),
    total_amount numeric,
    quantity integer,
    shipping_cost numeric,
    shipped_at timestamp,
    delivered_at timestamp,
    package_number INTEGER,
    carrier text,
    tracking_number text,
    status text
)