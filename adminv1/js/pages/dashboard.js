/*==========================================================
  Fashion Essentials Admin V1
  File: dashboard.js
  Description: Dashboard Page
  Version: 1.0
==========================================================*/

import API from "../core/api.js";
import { requireAdmin } from "../core/guard.js";

class Dashboard {

    constructor() {

        this.stats = {

            products: document.getElementById("totalProducts"),

            orders: document.getElementById("totalOrders"),

            customers: document.getElementById("totalCustomers"),

            revenue: document.getElementById("totalRevenue")

        };

    }

    async init() {

        await this.loadDashboard();

        this.bindEvents();

    }

    async loadDashboard() {

        try {

            await Promise.all([

                this.loadProducts(),

                this.loadOrders(),

                this.loadCustomers(),

                this.loadRevenue()

            ]);

        }

        catch (error) {

            console.error("Dashboard Error:", error);

        }

    }

    async loadProducts() {

        try {

            const products = await API.get("/products");

            this.stats.products.textContent =

                Array.isArray(products)

                    ? products.length

                    : 0;

        }

        catch {

            this.stats.products.textContent = "0";

        }

    }

    async loadOrders() {

        try {

            const orders = await API.get("/orders");

            this.stats.orders.textContent =

                Array.isArray(orders)

                    ? orders.length

                    : 0;

        }

        catch {

            this.stats.orders.textContent = "0";

        }

    }

    async loadCustomers() {

        try {

            const customers = await API.get("/customers");

            this.stats.customers.textContent =

                Array.isArray(customers)

                    ? customers.length

                    : 0;

        }

        catch {

            this.stats.customers.textContent = "0";

        }

    }

    async loadRevenue() {

        try {

            const orders = await API.get("/orders");

            let total = 0;

            if (Array.isArray(orders)) {

                total = orders.reduce((sum, order) => {

                    return sum + (Number(order.total) || 0);

                }, 0);

            }

            this.stats.revenue.textContent =

                `Rs. ${total.toLocaleString()}`;

        }

        catch {

            this.stats.revenue.textContent = "Rs. 0";

        }

    }

    bindEvents() {

        document.addEventListener(

            "global-search",

            event => {

                console.log(

                    "Search:",

                    event.detail

                );

            }

        );

    }

}

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        if (!await requireAdmin()) return;

        const dashboard = new Dashboard();

        dashboard.init();

    }

);
