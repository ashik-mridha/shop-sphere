# ShopSphere – Storefront

React 19 + Vite + Tailwind CSS 4 single-page app for the ShopSphere store. Talks to `../shopSphere-server`.

## Run locally

```bash
# 1. API (see ../shopSphere-server/README.md): npm install, .env, npm run seed, npm run dev
# 2. This app
npm install
cp .env.example .env     # leave VITE_API_URL empty in development
npm run dev              # http://localhost:5173
```

In development the Vite dev server proxies `/api` to the backend (`VITE_DEV_API_TARGET`, default `http://127.0.0.1:5000`), so the app and API share one origin and cookies just work. In production set `VITE_API_URL` to the API origin and `CLIENT_URL` on the server to this app's origin.

Demo logins (after `npm run seed` on the server): `admin@shopsphere.demo` / `Admin@12345` and `user@shopsphere.demo` / `Demo@12345`.

To test payments, follow the Stripe section of the server README (`stripe listen --forward-to localhost:5000/api/payments/webhook`, card `4242 4242 4242 4242`).

## Scripts

| Script | |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | production build into `dist/` (route-level code splitting) |
| `npm run lint` | ESLint |
| `npm run preview` | serve the production build |

## Structure

```
src/
  components/ui/       design-system primitives (Button, Input, Card, Badge, Modal, Table, Dropdown,
                       Skeleton, EmptyState, Pagination, StarRating, ...)
  components/layout/   Navbar, Footer, MobileBottomNav, Logo, ThemeToggle
  components/shop/     ProductCard, ProductGrid
  context/             Theme (light/dark), Wishlist
  hooks/               useFetch, useAuth, useCart, usePageMeta, useDebounce
  layouts/             MainLayout (storefront), DashboardLayout (user + admin)
  lib/                 api client, config, formatting, cart store, Better Auth client
  pages/               one folder per area: home, shop, cart, checkout, auth, user, admin, static, ...
  routes/              ProtectedRoute (login + role guard)
```

## Design system

- **Colours** (CSS variables in `src/index.css`, light + dark): one primary (emerald), one accent (amber), danger (red) and neutrals. Use semantic classes such as `bg-surface`, `text-muted`, `border-line`, `bg-primary text-primary-fg`; never hard-code hex values.
- **Radius**: controls `rounded-lg`, cards `rounded-xl`, modals/hero `rounded-2xl`, pills `rounded-full`.
- **Type**: Plus Jakarta Sans; `text-sm` for UI, `text-base` body, `text-2xl`–`text-4xl` for titles.
- Dark mode is a `.dark` class on `<html>` (toggle in the header, remembered in `localStorage`, follows the OS by default).

## Notes

- The cart lives in `localStorage` for guests; **every price is recomputed on the server** at cart and checkout time.
- Wishlist, addresses, reviews and orders live in MongoDB behind login.
- Payments use Stripe Checkout (hosted page). Card data never touches this app or the API.
