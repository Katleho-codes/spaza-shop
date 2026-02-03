CREATE TABLE carts (
    id bigserial PRIMARY KEY,
    user_id bigint REFERENCES users(id),
    product_id bigint REFERENCES products(id),
    quantity int,
    updated_at timestamp
);