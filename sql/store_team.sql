create table store_team (
    id bigserial primary key,
    created_at timestamp,
    updated_at timestamp,
    role text,
    user_id integer references users(id) ON DELETE CASCADE,
    position varchar(100),
    store_id integer references stores(id) ON DELETE CASCADE,
    staff_id text -- will be auto generated upon entry
)