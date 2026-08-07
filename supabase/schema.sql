-- Member profile information.
create table if not exists public.profiles (
    id uuid primary key
        references auth.users(id)
        on delete cascade,

    display_name text not null
        check (
        char_length(display_name) between 1 and 80
        ),

    wellness_goal text not null
        default 'Explore drinks',

    created_at timestamptz not null
        default now(),

    updated_at timestamptz not null
        default now()
);

-- Recipes saved by authenticated members.
create table if not exists public.favorites (
    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    drink_id text not null,
    drink_name text not null,
    drink_image text,
    category text,

    created_at timestamptz not null
        default now(),

    primary key (user_id, drink_id)
);

create index if not exists favorites_user_id_index
    on public.favorites(user_id);

alter table public.profiles
    enable row level security;

alter table public.favorites
    enable row level security;

drop policy if exists
    "Members can read their profile"
    on public.profiles;

create policy
    "Members can read their profile"
    on public.profiles
    for select
    using (auth.uid() = id);


drop policy if exists
    "Members can create their profile"
    on public.profiles;

create policy
    "Members can create their profile"
    on public.profiles
    for insert
    with check (auth.uid() = id);


drop policy if exists
    "Members can update their profile"
    on public.profiles;

create policy
    "Members can update their profile"
    on public.profiles
    for update
    using (auth.uid() = id)
    with check (auth.uid() = id);


drop policy if exists
    "Members can delete their profile"
    on public.profiles;

create policy
    "Members can delete their profile"
    on public.profiles
    for delete
    using (auth.uid() = id);

drop policy if exists
    "Members can read their favorites"
    on public.favorites;

create policy
    "Members can read their favorites"
    on public.favorites
    for select
    using (auth.uid() = user_id);


drop policy if exists
    "Members can add favorites"
    on public.favorites;

create policy
    "Members can add favorites"
    on public.favorites
    for insert
    with check (auth.uid() = user_id);


drop policy if exists
    "Members can update favorites"
    on public.favorites;

create policy
    "Members can update favorites"
    on public.favorites
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);


drop policy if exists
    "Members can delete favorites"
    on public.favorites;

create policy
    "Members can delete favorites"
    on public.favorites
    for delete
    using (auth.uid() = user_id);