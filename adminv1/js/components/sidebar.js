/*==========================================================*
 * NexPage Commerce Platform
 * File: sidebar.js
 * Description: Sidebar Component
 * Version: 1.0
 *==========================================================*/

import { CONFIG } from "../core/config.js";
import { authApi } from "../core/api.js";

class Sidebar {
    constructor() {
        this.container =
            document.getElementById("sidebar");

        this.page =
            document.body.dataset.page || "";
    }

    async init() {
        if (!this.container) return;

        await this.load();

        this.setActivePage();
        this.restoreState();
        this.bindEvents();
        this.initIcons();
    }

    async load() {
        try {
            const response = await fetch(new URL("../../components/sidebar/sidebar.html", import.meta.url));

            if (!response.ok) {
                throw new Error(
                    `Unable to load sidebar. HTTP ${response.status}`
                );
            }

            this.container.innerHTML =
                await response.text();

        } catch (error) {
            console.error(
                "Sidebar load error:",
                error
            );
        }
    }

    setActivePage() {
        const links =
            this.container.querySelectorAll(
                ".sidebar__link"
            );

        links.forEach((link) => {
            link.classList.remove("active");

            if (
                link.dataset.page ===
                this.page
            ) {
                link.classList.add("active");
            }
        });
    }

    bindEvents() {
        const toggle =
            document.getElementById(
                "sidebarToggle"
            );

        if (toggle) {
            toggle.addEventListener(
                "click",
                () => {
                    this.toggle();
                }
            );
        }

        const logoutBtn =
            document.getElementById(
                "logoutBtn"
            );

        if (logoutBtn) {
            logoutBtn.addEventListener(
                "click",
                async () => {
                    try {
                        await authApi.logout();

                        window.location.href =
                            "../login.html";

                    } catch (error) {
                        console.error(
                            "Logout error:",
                            error
                        );
                    }
                }
            );
        }
    }

    toggle() {
        this.container.classList.toggle(
            "open"
        );
    }

    collapse() {
        this.container.classList.toggle(
            "collapsed"
        );

        const collapsed =
            this.container.classList.contains(
                "collapsed"
            );

        localStorage.setItem(
            CONFIG.STORAGE.SIDEBAR,
            collapsed
        );
    }

    restoreState() {
        if (window.innerWidth < 1024) {
            return;
        }

        const collapsed =
            localStorage.getItem(
                CONFIG.STORAGE.SIDEBAR
            );

        if (collapsed === "true") {
            this.container.classList.add(
                "collapsed"
            );
        }
    }

    initIcons() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
}

const sidebar = new Sidebar();

sidebar.init();

export default sidebar;dir /s /b sidebar.sidebar.html
