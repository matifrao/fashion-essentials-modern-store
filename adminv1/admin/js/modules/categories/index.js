/*==========================================================
  NexPage Commerce Platform

  File: index.js
  Description: Category Module Controller

  Module: Categories

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

import general from "./general.js";

import image from "./image.js";

import seo from "./seo.js";

import validation from "./validation.js";

import save from "./save.js";


class CategoryModule {

    constructor() {

        this.form =
            document.getElementById(
                "categoryForm"
            );

    }


    /*======================================================
      Initialize
    ======================================================*/

    init() {

        if (!this.form) return;


        /*
         * Initialize UI modules first.
         */

        general.init();

        image.init();

        seo.init();


        /*
         * Initialize save handlers.
         */

        save.init();


        /*
         * Bind category-specific events.
         */

        this.bindEvents();

    }


    /*======================================================
      Events
    ======================================================*/

    bindEvents() {

        this.form.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                this.handleSubmit();

            }
        );

    }


    /*======================================================
      Submit
    ======================================================*/

    async handleSubmit() {

        const data =
            save.collectData();


        /*
         * Add selected category image
         * to the collected data.
         */

        const imageFile =
            image.getFile();


        if (imageFile) {

            data.image = {

                name:
                    imageFile.name,

                type:
                    imageFile.type,

                size:
                    imageFile.size

            };

        }


        /*
         * Validate complete category data.
         */

        const result =
            validation.validate(data);


        if (!result.valid) {

            validation.displayErrors(
                result.errors
            );


            const firstError =
                validation.firstError(
                    result.errors
                );


            if (firstError) {

                this.showValidationMessage(
                    firstError
                );

            }


            this.focusFirstError(
                result.errors
            );


            return;

        }


        /*
         * Clear previous validation errors.
         */

        validation.clearErrors();


        /*
         * Save validated category.
         *
         * save.js collects the current form
         * again before sending it to the API.
         */

        await save.save();

    }


    /*======================================================
      Validation Message
    ======================================================*/

    showValidationMessage(message) {

        /*
         * Prefer the NexPage notification system
         * if available through the save module.
         *
         * The validation field errors remain visible
         * beside the relevant fields.
         */

        console.warn(
            "Category validation:",
            message
        );

    }


    /*======================================================
      Focus First Error
    ======================================================*/

    focusFirstError(errors = {}) {

        const firstField =
            Object.keys(errors)[0];


        if (!firstField) return;


        const fieldMap = {

            name:
                "categoryName",

            slug:
                "categorySlug",

            sortOrder:
                "sortOrder",

            seoTitle:
                "seoTitle",

            seoDescription:
                "seoDescription",

            canonical:
                "canonicalUrl"

        };


        const element =
            document.getElementById(
                fieldMap[firstField] ||
                firstField
            );


        element?.focus();

    }

}


/*==========================================================
  Start Module
==========================================================*/

const categoryModule =
    new CategoryModule();


document.addEventListener(
    "DOMContentLoaded",
    () => {

        categoryModule.init();

    }
);


export default categoryModule;