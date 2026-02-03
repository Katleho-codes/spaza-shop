create table orders (
    id bigserial primary key,
    created_at timestamp,
    updated_at timestamp,
    order_number text unique not null,
    user_id integer references users(id) ON DELETE CASCADE,
    store_id integer references stores(id) ON DELETE CASCADE,
    product_id integer references products(id) ON DELETE CASCADE,
    total_amount numeric,
    quantity integer,
    status text,
    currency varchar(3) default 'ZAR'
)
