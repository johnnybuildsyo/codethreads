alter table public.projects
add column if not exists display_name text;

update public.projects
set display_name = name
where display_name is null;

alter table public.projects
alter column display_name set not null; 