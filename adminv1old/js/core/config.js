/*==========================================================
  Fashion Essentials Admin V1
  File: config.js
  Description: Global Application Configuration
  Version: 2.0
==========================================================*/

export const CONFIG = {

    /*======================================================
      Application
    ======================================================*/

    APP: {

        NAME: "Fashion Essentials Admin",

        VERSION: "2.0.0",

        COMPANY: "Fashion Essentials",

        DEBUG: true

    },



    /*======================================================
      API
    ======================================================*/

    API: {

        BASE_URL: "http://localhost:3000",

        TIMEOUT: 30000

    },



    /*======================================================
      Endpoints
    ======================================================*/

    ENDPOINTS: {

        LOGIN: "/api/login",

        LOGOUT: "/api/logout",

        PROFILE: "/api/me",

        DASHBOARD: "/api/dashboard",

        PRODUCTS: "/api/products",

        CATEGORIES: "/api/categories",

        BRANDS: "/api/brands",

        COLORS: "/api/colors",

        ORDERS: "/api/orders",

        CUSTOMERS: "/api/customers",

        SETTINGS: "/api/settings"

    },



    /*======================================================
      Authentication
    ======================================================*/

    AUTH: {

        LOGIN_PAGE: "login.html",

        DASHBOARD_PAGE: "dashboard.html",

        SESSION_TIMEOUT: 86400000

    },



    /*======================================================
      Storage Keys
    ======================================================*/

    STORAGE: {

        TOKEN: "fe_admin_token",

        USER: "fe_admin_user",

        THEME: "fe_theme",

        SIDEBAR: "fe_sidebar",

        PRODUCT_DRAFT: "fe_product_draft",

        DASHBOARD_FILTERS: "fe_dashboard_filters"

    },



    /*======================================================
      Upload
    ======================================================*/

    UPLOAD: {

        MAX_IMAGE_SIZE: 5 * 1024 * 1024,

        MAX_IMAGES: 20,

        IMAGE_PATH: "/uploads/products/",

        ALLOWED_TYPES: [

            "image/jpeg",

            "image/png",

            "image/webp"

        ]

    },



    /*======================================================
      Product Defaults
    ======================================================*/

    PRODUCT: {

        DEFAULT_STATUS: "Draft",

        DEFAULT_STOCK: 0,

        DEFAULT_CURRENCY: "PKR",

        DEFAULT_CURRENCY_SYMBOL: "Rs.",

        LOW_STOCK_LIMIT: 5

    },



    /*======================================================
      Pagination
    ======================================================*/

    PAGINATION: {

        DEFAULT_SIZE: 10,

        OPTIONS: [

            10,

            25,

            50,

            100

        ]

    },



    /*======================================================
      Dashboard
    ======================================================*/

    DASHBOARD: {

        RECENT_PRODUCTS: 5,

        RECENT_ORDERS: 10,

        RECENT_CUSTOMERS: 10

    },



    /*======================================================
      Email
    ======================================================*/

    EMAIL: {

        ORDER_NOTIFICATION: true,

        CUSTOMER_CONFIRMATION: true,

        ADMIN_NOTIFICATION: true

    },



    /*======================================================
      User Interface
    ======================================================*/

    UI: {

        DEFAULT_THEME: "light",

        TOAST_DURATION: 4000,

        SIDEBAR_WIDTH: 270,

        MOBILE_BREAKPOINT: 768

    },



    /*======================================================
      Features
    ======================================================*/

    FEATURES: {

        INVENTORY: true,

        VARIANTS: true,

        COLORS: true,

        CATEGORIES: true,

        BRANDS: true,

        CUSTOMERS: true,

        ORDERS: true,

        REPORTS: true,

        COUPONS: false,

        REVIEWS: false,

        ANALYTICS: true

    },



    /*======================================================
      Default Values
    ======================================================*/

    DEFAULTS: {

        CATEGORY: "Uncategorized",

        BRAND: "Fashion Essentials",

        STATUS: "Draft"

    }

};



/*==========================================================
  Freeze Configuration
==========================================================*/

Object.freeze(CONFIG.APP);

Object.freeze(CONFIG.API);

Object.freeze(CONFIG.ENDPOINTS);

Object.freeze(CONFIG.AUTH);

Object.freeze(CONFIG.STORAGE);

Object.freeze(CONFIG.UPLOAD);

Object.freeze(CONFIG.PRODUCT);

Object.freeze(CONFIG.PAGINATION);

Object.freeze(CONFIG.DASHBOARD);

Object.freeze(CONFIG.EMAIL);

Object.freeze(CONFIG.UI);

Object.freeze(CONFIG.FEATURES);

Object.freeze(CONFIG.DEFAULTS);

Object.freeze(CONFIG);