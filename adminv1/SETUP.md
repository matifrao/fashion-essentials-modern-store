# AdminV1 customer deployment

This folder is independent from the existing website and old admin. It is a static Netlify-ready admin that uses Supabase for secure login, data and product images.

## For every customer

1. Create a new Supabase project for that customer.
2. Run `supabase-schema.sql` in **SQL Editor**.
3. In **Authentication > Users**, add the first admin user's email and password. Do not enable public sign-ups unless the customer needs it.
4. Copy Project URL and anon/publishable key from **Project Settings > API** into `js/supabase-config.js`.
5. Upload only this `adminv1` folder to Netlify (or include it as the `/adminv1` folder in the customer site). The site must be served over HTTP(S); opening the HTML file directly will not work.

## Security notes

- The browser config contains only the Supabase anon key. This is normal and safe because the SQL file enables Row Level Security.
- Never put the Supabase `service_role` key in a website, Netlify static file, or Git repository.
- Every admin user sees only records created by their own login. For a store with several staff members who must share one catalogue, contact me before deployment: that needs a store/team table and role policy.
- A separate Supabase project per licensed customer prevents one customer from accessing another customer's products.

## Included functions

- Supabase email/password protected login
- Product catalogue, stock, price, product images and categories/brands data layer
- Blog post manager
- Netlify-compatible static deployment; no local SQL or Node server needed
