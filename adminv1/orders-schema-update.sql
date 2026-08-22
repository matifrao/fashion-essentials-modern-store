-- Run this once in Supabase: SQL Editor > New query.
-- Safe to run even though an "orders" table already exists — the old one
-- was an unused placeholder (cloned from the products table shape) and
-- has never had any real orders written to it.

drop table if exists public.orders cascade;

create sequence if not exists public.orders_order_number_seq start 1000;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null default ('FE-' || nextval('public.orders_order_number_seq')::text),
  customer_name text not null default '',
  customer_email text default '',
  customer_phone text default '',
  shipping_address text default '',
  city text default '',
  postal_code text default '',
  payment_method text default '',
  notes text default '',
  items jsonb not null default '[]'::jsonb,
  subtotal numeric not null default 0,
  total numeric not null default 0,
  status text not null default 'Pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Guest customers (using the public anon key from checkout.js) can create
-- an order, but cannot read, edit, or delete any order — including their
-- own — once it's placed.
create policy "public can place orders"
  on public.orders
  for insert
  to anon, authenticated
  with check (true);

-- Only a logged-in admin (i.e. someone who has signed in through
-- adminv1/login.html) can view, update, or delete orders.
create policy "admin can view orders"
  on public.orders
  for select
  to authenticated
  using (true);

create policy "admin can update orders"
  on public.orders
  for update
  to authenticated
  using (true)
  with check (true);

create policy "admin can delete orders"
  on public.orders
  for delete
  to authenticated
  using (true);
