/*==========================================================
  NexPage Commerce Platform

  File: index.js
  Description: Product Editor Controller

  Module: Catalog / Products

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

import media from "./media.js";
import general from "./general.js";
import sidebar from "./sidebar.js";
import pricing from "./pricing.js";
import inventory from "./inventory.js";
import variants from "./variants.js";
import shipping from "./shipping.js";
import seo from "./seo.js";
import save from "./save.js";
import { productsApi } from "../../core/api.js";
import { requireAdmin } from "../../core/guard.js";

/*==========================================================
  Product Editor
==========================================================*/

class ProductEditor {

    constructor() {

        this.modules = [];

    }

    /*======================================================
      Initialize
    ======================================================*/

    async init() {

        this.initializeModules();

        const id = new URLSearchParams(window.location.search).get("id");
        if (id) {
            const product = await productsApi.get(id);
            if (product) {
                document.getElementById("productForm").dataset.productId = id;
                [general, media, sidebar, pricing, inventory, variants, shipping, seo].forEach(module => module.setData?.(product));
                const title = document.getElementById("pageTitle");
                if (title) title.textContent = "Edit Product";
            }
        }

        console.log("Product Editor Initialized");

    }

    /*======================================================
      Modules
    ======================================================*/

    initializeModules() {

        this.modules = [

            media, general, sidebar, pricing, inventory, variants, shipping, seo, save

        ];

        this.modules.forEach(module => {

            if (module && typeof module.init === "function") {

                module.init();

            }

        });

    }

}

/*==========================================================
  DOM Ready
==========================================================*/

document.addEventListener("DOMContentLoaded", async () => {

    if (!await requireAdmin()) return;
    const editor = new ProductEditor();

    try { await editor.init(); } catch (error) { alert(error.message); }

});
