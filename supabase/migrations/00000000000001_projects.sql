create table public.projects (
  id uuid default gen_random_uuid() primary key,
  github_id bigint not null,
  name text not null,
  display_name text not null,
  full_name text not null,
  description text,
  owner_id uuid references auth.users(id) not null,
  profile_id uuid references profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.projects enable row level security;

-- Create policies
create policy "Projects are viewable by everyone"
  on projects for select
  using ( true );

create policy "Users can create their own projects"
  on projects for insert
  with check ( auth.uid() = owner_id );

create policy "Users can update their own projects"
  on projects for update
  using ( auth.uid() = owner_id ); 