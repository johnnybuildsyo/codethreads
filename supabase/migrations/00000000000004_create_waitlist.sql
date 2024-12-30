create table public.waitlist (
  id uuid not null default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamp with time zone not null default now()
);

-- Enable RLS
alter table public.waitlist enable row level security;

-- Only allow service role to insert
create policy "Service role can insert into waitlist" on public.waitlist
  for insert
  to service_role
  with check (true);

-- Only allow admins to view waitlist
create policy "Only admins can view waitlist" on public.waitlist
  for select
  using (auth.jwt() ->> 'email' = any(string_to_array(current_setting('app.admin_emails', true), ','))); 