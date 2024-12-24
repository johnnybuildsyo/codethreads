create table public.threads (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) not null,
  title text not null,
  teaser text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.posts (
  id uuid default gen_random_uuid() primary key,
  thread_id uuid references threads(id) not null,
  commit_sha text,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.threads enable row level security;
alter table public.posts enable row level security;

-- Create policies
create policy "Threads are viewable by everyone"
  on threads for select using ( true );

create policy "Posts are viewable by everyone"
  on posts for select using ( true );

create policy "Project owners can create threads"
  on threads for insert
  with check ( auth.uid() in (
    select owner_id from projects where id = project_id
  ));

create policy "Project owners can create posts"
  on posts for insert
  with check ( auth.uid() in (
    select p.owner_id 
    from posts po
    join threads t on t.id = po.thread_id
    join projects p on p.id = t.project_id
  )); 