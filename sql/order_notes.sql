create table order_notes (
    id bigserial primary key,
    created_at timestamp,
    updated_at timestamp,
    note_text text,
    user_id integer references users(id) ON DELETE CASCADE,
    order_id integer references orders(id) ON DELETE CASCADE,
    store_id integer references stores(id) ON DELETE CASCADE,
)