/*==========================================================
  NexPage Commerce Platform

  File: index.js
  Description: Product Editor Controller

  Module: Catalog / Products

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

import media from "./media.js";

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

    init() {

        this.initializeModules();

        console.log("Product Editor Initialized");

    }

    /*======================================================
      Modules
    ======================================================*/

    initializeModules() {

        this.modules = [

            media

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

document.addEventListener("DOMContentLoaded", () => {

    const editor = new ProductEditor();

    editor.init();

});