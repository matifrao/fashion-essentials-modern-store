-- Run this entire file once in Supabase: SQL Editor > New query.
-- Each customer should use a separate Supabase project.
create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null default '', slug text default '', sku text default '', status text default 'Draft',
  price numeric default 0, stock integer default 0, category text default '', brand text default '', images jsonb default '[]'::jsonb,
  data jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.categories (like public.products including defaults including constraints);
create table if not exists public.brands (like public.products including defaults including constraints);
create table if not exists public.blog_posts (like public.products including defaults including constraints);
create table if not exists public.orders (like public.products including defaults including constraints);
create table if not exists public.customers (like public.products including defaults including constraints);

alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.blog_posts enable row level security;
alter table public.orders enable row level security;
alter table public.customers enable row level security;

do $$ declare t text; begin
  foreach t in array array['products','categories','brands','blog_posts','orders','customers'] loop
    execute format('drop policy if exists "owner access" on public.%I', t);
    execute format('create policy "owner access" on public.%I for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid())', t);
  end loop;
end $$;

insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict (id) do nothing;
drop policy if exists "authenticated image upload" on storage.objects;
create policy "authenticated image upload" on storage.objects for insert to authenticated with check (bucket_id = 'product-images');
drop policy if exists "public image view" on storage.objects;
create policy "public image view" on storage.objects for select to public using (bucket_id = 'product-images');
drop policy if exists "owner image delete" on storage.objects;
create policy "owner image delete" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and owner_id = auth.uid()::text);
