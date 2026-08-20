/* Public configuration only. Never put a Supabase service-role key in this file. */
export const CONFIG = {
  APP: { NAME: "Fashion Essentials Admin", VERSION: "3.0.0", DEBUG: false },
  AUTH: { LOGIN_PAGE: "login.html", DASHBOARD_PAGE: "dashboard.html" },
  STORAGE: { TOKEN: "fe_admin_token", USER: "fe_admin_user", THEME: "fe_theme", SIDEBAR: "fe_sidebar" },
  TOKEN_KEY: "fe_admin_token", USER_KEY: "fe_admin_user", DEFAULT_THEME: "light",
  UPLOAD: { MAX_IMAGE_SIZE: 5 * 1024 * 1024, MAX_IMAGES: 20, ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"] },
  PRODUCT: { DEFAULT_STATUS: "Draft", DEFAULT_STOCK: 0, DEFAULT_CURRENCY_SYMBOL: "Rs.", LOW_STOCK_LIMIT: 5 }
};
