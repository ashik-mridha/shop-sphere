// Empty VITE_API_URL = same origin (the Vite dev server proxies /api to the backend, see vite.config.js).
export const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export const SITE_NAME = "ShopSphere";
export const SITE_TAGLINE = "Quality tech and everyday essentials, delivered.";
export const SUPPORT_EMAIL = "support@shopsphere.example";

export const CART_KEY = "shopsphere_cart";
export const THEME_KEY = "shopsphere_theme";
