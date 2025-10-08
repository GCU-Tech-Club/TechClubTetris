create table sessions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null,
    session_id uuid not null,
    created_at timestamp with time zone not null default now()
);

create index idx_sessions_user_id on sessions(user_id);
create index idx_sessions_session_id on sessions(session_id);