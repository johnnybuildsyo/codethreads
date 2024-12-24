create table public.commits (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) not null,
  sha text not null,
  message text not null,
  author_name text not null,
  author_email text not null,
  authored_at timestamp with time zone not null,
  thread_id uuid references threads(id),
  status text check (status in ('pending', 'threaded', 'ignored')) not null default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(project_id, sha)
);

-- Enable RLS
alter table public.commits enable row level security;

-- Create policies
create policy "Commits are viewable by everyone"
  on commits for select using ( true );

create policy "Project owners can manage commits"
  on commits for all using (
    auth.uid() in (
      select owner_id from projects where id = project_id
    )
  ); 