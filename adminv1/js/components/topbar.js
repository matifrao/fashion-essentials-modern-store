/*==========================================================*
* Fashion Essentials Admin V1
* File: topbar.js
* Description: Topbar Component
* Version: 1.0
*==========================================================*/

import { CONFIG } from "../core/config.js";

class Topbar {
    constructor() {
        this.container =
            document.getElementById("topbar");

        this.page =
            document.body.dataset.page || "";
    }

    async init() {
        if (!this.container) return;

        await this.load();

        this.setPageInfo();
        this.bindEvents();
        this.initIcons();
    }

    async load() {
        try {
            const response = await fetch(new URL("../../components/topbar.html", import.meta.url));

            if (!response.ok) {
                throw new Error(
                    `Unable to load topbar. HTTP ${response.status}`
                );
            }

            this.container.innerHTML =
                await response.text();

        } catch (error) {
            console.error(
                "Topbar load error:",
                error
            );
        }
    }

    setPageInfo() {
        const pages = {
            dashboard: {
                title: "Dashboard",
                subtitle: "Welcome back."
            },

            products: {
                title: "Products",
                subtitle: "Manage your products."
            },

            categories: {
                title: "Categories",
                subtitle: "Manage product categories."
            },

            colors: {
                title: "Colors",
                subtitle: "Manage color library."
            },

            brands: {
                title: "Brands",
                subtitle: "Manage brands."
            },

            orders: {
                title: "Orders",
                subtitle: "Manage customer orders."
            },

            customers: {
                title: "Customers",
                subtitle: "Manage customers."
            },

            blogs: { title: "Blog Posts", subtitle: "Write and publish blog posts." },

            settings: {
                title: "Settings",
                subtitle: "Store configuration."
            }
        };

        const title =
            this.container.querySelector(
                "#pageTitle"
            );

        const subtitle =
            this.container.querySelector(
                "#pageSubtitle"
            );

        const current =
            pages[this.page];

        if (!current) return;

        if (title) {
            title.textContent =
                current.title;
        }

        if (subtitle) {
            subtitle.textContent =
                current.subtitle;
        }
    }

    bindEvents() {
        const themeToggle =
            this.container.querySelector(
                "#themeToggle"
            );

        if (themeToggle) {
            themeToggle.addEventListener(
                "click",
                () => {
                    this.toggleTheme();
                }
            );
        }

        const search =
            this.container.querySelector(
                "#globalSearch"
            );

        if (search) {
            search.addEventListener(
                "input",
                (event) => {
                    document.dispatchEvent(
                        new CustomEvent(
                            "global-search",
                            {
                                detail:
                                    event.target
                                        .value
                            }
                        )
                    );
                }
            );
        }
    }

    toggleTheme() {
        const current =
            document.documentElement
                .dataset.theme;

        const next =
            current === "dark"
                ? "light"
                : "dark";

        document.documentElement.dataset.theme =
            next;

        localStorage.setItem(
            CONFIG.STORAGE.THEME,
            next
        );
    }

    initIcons() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
}

const topbar = new Topbar();

topbar.init();

export default topbar;
