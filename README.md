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

## Product photos

All product and category data comes from the API; the frontend contains no product data. Photos are external `https` URLs stored in MongoDB (`image`, `images`, `imageAlts`, `imageCredits`) and rendered with `loading="lazy"`, `decoding="async"` and `referrerPolicy="no-referrer"` (Flickr hotlinking). Unsplash and Flickr URLs are resized by the UI (`?w=` / `_z`, see `src/lib/images.js`); a photo that fails to load is replaced by a neutral tile showing the product name.

### Image credits
Unsplash photos are free for commercial use and need no attribution. The photos below need attribution; it is shown under the product gallery.

| Product | Photographer | License | Source |
|---|---|---|---|
| Mechanical Keyboard K8 | phithanhviet | CC BY 2.0 | https://www.flickr.com/photos/99146016@N07/52309562776 |
| Brew Master Pour-Over Kettle | markolaz | CC BY 2.0 | https://www.flickr.com/photos/195403219@N08/52139170224 |
| Brew Master Pour-Over Kettle | markolaz | CC BY 2.0 | https://www.flickr.com/photos/195403219@N08/52139569650 |
| Brew Master Pour-Over Kettle | markolaz | CC BY 2.0 | https://www.flickr.com/photos/195403219@N08/52135222918 |
| Bamboo Cutting Board | ela haney | CC0 | https://stocksnap.io/photo/wooden-chopping-IJQN8ZVH8M |
| Bamboo Cutting Board | nenadstojkovicart | CC BY 2.0 | https://www.flickr.com/photos/202846129@N03/54536057307 |
| Compact Air Fryer 4 L | Haydn Blackey | CC BY-SA 2.0 | https://www.flickr.com/photos/54549113@N00/54005130467 |

If a photo URL stops working, replace it from the admin product form (or edit `seed-data/products.json` and re-run `npm run catalog:import`).
