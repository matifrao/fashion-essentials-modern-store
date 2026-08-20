/*==========================================================
  Fashion Essentials Admin V1
  File: constants.js
  Description: Business Constants
  Version: 1.0
==========================================================*/


/*==========================================================
  Product Status
==========================================================*/

export const PRODUCT_STATUS = Object.freeze({

    DRAFT: "Draft",

    ACTIVE: "Active",

    ARCHIVED: "Archived",

    OUT_OF_STOCK: "Out of Stock",

    COMING_SOON: "Coming Soon"

});


/*==========================================================
  Order Status
==========================================================*/

export const ORDER_STATUS = Object.freeze({

    PENDING: "Pending",

    CONFIRMED: "Confirmed",

    PROCESSING: "Processing",

    PACKED: "Packed",

    SHIPPED: "Shipped",

    DELIVERED: "Delivered",

    CANCELLED: "Cancelled",

    REFUNDED: "Refunded"

});


/*==========================================================
  Payment Status
==========================================================*/

export const PAYMENT_STATUS = Object.freeze({

    PENDING: "Pending",

    PAID: "Paid",

    FAILED: "Failed",

    REFUNDED: "Refunded"

});


/*==========================================================
  Payment Methods
==========================================================*/

export const PAYMENT_METHODS = Object.freeze({

    CASH_ON_DELIVERY: "Cash on Delivery",

    BANK_TRANSFER: "Bank Transfer",

    EASYPAISA: "Easypaisa",

    JAZZCASH: "JazzCash"

});


/*==========================================================
  User Roles
==========================================================*/

export const USER_ROLES = Object.freeze({

    SUPER_ADMIN: "Super Admin",

    ADMIN: "Admin",

    MANAGER: "Manager",

    STAFF: "Staff"

});


/*==========================================================
  Customer Status
==========================================================*/

export const CUSTOMER_STATUS = Object.freeze({

    ACTIVE: "Active",

    BLOCKED: "Blocked"

});


/*==========================================================
  Inventory Status
==========================================================*/

export const STOCK_STATUS = Object.freeze({

    IN_STOCK: "In Stock",

    LOW_STOCK: "Low Stock",

    OUT_OF_STOCK: "Out of Stock"

});


/*==========================================================
  Product Visibility
==========================================================*/

export const PRODUCT_VISIBILITY = Object.freeze({

    PUBLIC: "Public",

    PRIVATE: "Private",

    HIDDEN: "Hidden"

});


/*==========================================================
  Gender
==========================================================*/

export const GENDER = Object.freeze({

    WOMEN: "Women",

    MEN: "Men",

    UNISEX: "Unisex",

    KIDS: "Kids"

});


/*==========================================================
  Default Sizes
==========================================================*/

export const DEFAULT_SIZES = Object.freeze([

    "Free Size",

    "XS",

    "S",

    "M",

    "L",

    "XL",

    "XXL"

]);


/*==========================================================
  Product Labels
==========================================================*/

export const PRODUCT_LABELS = Object.freeze({

    NEW: "New",

    FEATURED: "Featured",

    BEST_SELLER: "Best Seller",

    SALE: "Sale"

});


/*==========================================================
  Supported Currencies
==========================================================*/

export const CURRENCIES = Object.freeze({

    PKR: {

        code: "PKR",

        symbol: "Rs."

    },

    USD: {

        code: "USD",

        symbol: "$"

    }

});


/*==========================================================
  Languages
==========================================================*/

export const LANGUAGES = Object.freeze({

    ENGLISH: "en",

    URDU: "ur"

});