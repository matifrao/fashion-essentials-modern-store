/*==========================================================
  Fashion Essentials Admin V1
  File: api.js
  Description: API Service
  Version: 2.0
==========================================================*/

import { CONFIG } from "./config.js";
import { storage } from "./storage.js";

/*==========================================================
  Base Request
==========================================================*/

async function request(endpoint, options = {}) {

    const headers = {

        ...options.headers

    };

    if (!(options.body instanceof FormData)) {

        headers["Content-Type"] = "application/json";

    }

    const token = storage.getToken();

    if (token) {

        headers.Authorization = `Bearer ${token}`;

    }

    const response = await fetch(

        `${CONFIG.API_BASE}${endpoint}`,

        {

            ...options,

            headers

        }

    );

    let data = null;

    try {

        data = await response.json();

    }

    catch {

        data = null;

    }

    if (!response.ok) {

        throw new Error(

            data?.message ||

            "Something went wrong."

        );

    }

    return data;

}

/*==========================================================
  HTTP Methods
==========================================================*/

export const http = {

    get(endpoint) {

        return request(endpoint);

    },

    post(endpoint, body) {

        return request(endpoint, {

            method: "POST",

            body: body instanceof FormData

                ? body

                : JSON.stringify(body)

        });

    },

    put(endpoint, body) {

        return request(endpoint, {

            method: "PUT",

            body: JSON.stringify(body)

        });

    },

    patch(endpoint, body) {

        return request(endpoint, {

            method: "PATCH",

            body: JSON.stringify(body)

        });

    },

    delete(endpoint) {

        return request(endpoint, {

            method: "DELETE"

        });

    }

};

/*==========================================================
  Authentication
==========================================================*/

export const authApi = {

    login(credentials) {

        return http.post(

            "/api/login",

            credentials

        );

    },

    logout() {

        return http.post(

            "/api/logout"

        );

    },

    me() {

        return http.get(

            "/api/me"

        );

    }

};

/*==========================================================
  Products
==========================================================*/

export const productsApi = {

    list() {

        return http.get(

            "/api/products"

        );

    },

    get(id) {

        return http.get(

            `/api/products/${id}`

        );

    },

    create(product) {

        return http.post(

            "/api/products",

            product

        );

    },

    update(id, product) {

        return http.put(

            `/api/products/${id}`,

            product

        );

    },

    patch(id, product) {

        return http.patch(

            `/api/products/${id}`,

            product

        );

    },

    delete(id) {

        return http.delete(

            `/api/products/${id}`

        );

    },

    changeStatus(id, status) {

        return http.patch(

            `/api/products/${id}/status`,

            {

                status

            }

        );

    },

    updateStock(id, stock) {

        return http.patch(

            `/api/products/${id}/stock`,

            {

                stock

            }

        );

    },

    search(query) {

        return http.get(

            `/api/products/search?q=${encodeURIComponent(query)}`

        );

    },

    variants(id) {

        return http.get(

            `/api/products/${id}/variants`

        );

    },

    upload(formData) {

        return request(

            "/api/uploads",

            {

                method: "POST",

                body: formData,

                headers: {}

            }

        );

    }

};
/*==========================================================
  Orders
==========================================================*/

export const ordersApi = {

    list() {

        return http.get(

            "/api/orders"

        );

    },

    get(id) {

        return http.get(

            `/api/orders/${id}`

        );

    },

    create(order) {

        return http.post(

            "/api/orders",

            order

        );

    },

    update(id, order) {

        return http.put(

            `/api/orders/${id}`,

            order

        );

    },

    patch(id, order) {

        return http.patch(

            `/api/orders/${id}`,

            order

        );

    },

    delete(id) {

        return http.delete(

            `/api/orders/${id}`

        );

    },

    changeStatus(id, status) {

        return http.patch(

            `/api/orders/${id}/status`,

            {

                status

            }

        );

    }

};

/*==========================================================
  Customers
==========================================================*/

export const customersApi = {

    list() {

        return http.get(

            "/api/customers"

        );

    },

    get(id) {

        return http.get(

            `/api/customers/${id}`

        );

    },

    create(customer) {

        return http.post(

            "/api/customers",

            customer

        );

    },

    update(id, customer) {

        return http.put(

            `/api/customers/${id}`,

            customer

        );

    },

    delete(id) {

        return http.delete(

            `/api/customers/${id}`

        );

    },

    search(query) {

        return http.get(

            `/api/customers/search?q=${encodeURIComponent(query)}`

        );

    }

};

/*==========================================================
  Categories
==========================================================*/

export const categoriesApi = {

    list() {

        return http.get(

            "/api/categories"

        );

    },

    get(id) {

        return http.get(

            `/api/categories/${id}`

        );

    },

    create(category) {

        return http.post(

            "/api/categories",

            category

        );

    },

    update(id, category) {

        return http.put(

            `/api/categories/${id}`,

            category

        );

    },

    delete(id) {

        return http.delete(

            `/api/categories/${id}`

        );

    }

};

/*==========================================================
  Brands
==========================================================*/

export const brandsApi = {

    list() {

        return http.get(

            "/api/brands"

        );

    },

    get(id) {

        return http.get(

            `/api/brands/${id}`

        );

    },

    create(brand) {

        return http.post(

            "/api/brands",

            brand

        );

    },

    update(id, brand) {

        return http.put(

            `/api/brands/${id}`,

            brand

        );

    },

    delete(id) {

        return http.delete(

            `/api/brands/${id}`

        );

    }

};

/*==========================================================
  Dashboard
==========================================================*/

export const dashboardApi = {

    stats() {

        return http.get(

            "/api/dashboard"

        );

    }

};

/*==========================================================
  API Collection
==========================================================*/

export const api = {

    auth: authApi,

    dashboard: dashboardApi,

    products: productsApi,

    orders: ordersApi,

    customers: customersApi,

    categories: categoriesApi,

    brands: brandsApi

};

export default api;