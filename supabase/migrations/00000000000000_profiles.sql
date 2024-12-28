create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  name text,
  avatar_url text,
  bio text,
  github_username text,
  twitter_username text,
  links jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

comment on column public.profiles.links is 'Array of user links [{title: string, url: string}]'; 