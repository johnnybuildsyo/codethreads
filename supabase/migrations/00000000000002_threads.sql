create table public.threads (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) not null,
  title text not null,
  sections jsonb not null,
  commit_shas text[] not null default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.threads enable row level security;

-- Create policies
create policy "Threads are viewable by everyone"
  on threads for select using ( true );

create policy "Project owners can create threads"
  on threads for insert
  with check ( 
    exists (
      select 1 
      from projects 
      where id = project_id 
      and owner_id = auth.uid()
    )
  ); 