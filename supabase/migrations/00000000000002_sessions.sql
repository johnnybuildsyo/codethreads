create table public.sessions (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) not null,
  user_id uuid references auth.users(id) not null,
  title text not null,
  blocks jsonb not null,
  commit_shas text[] not null default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.sessions enable row level security;

-- Create policies
create policy "Sessions are viewable by everyone"
  on sessions for select using ( true );

create policy "Project owners can create sessions"
  on sessions for insert
  with check ( 
    exists (
      select 1 
      from projects 
      where id = project_id 
      and owner_id = auth.uid()
    )
  );

create policy "Session authors can update their sessions"
  on sessions for update
  using ( auth.uid() = user_id ); 