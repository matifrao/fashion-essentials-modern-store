/*==========================================================
  NexPage Commerce Platform

  File: save.js
  Description: Category Save Manager

  Module: Categories

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

import API from "../../core/api.js";

import notification from "../../core/notification.js";

import loader from "../../core/loader.js";

import confirm from "../../core/confirm.js";


class CategorySave {

    constructor() {

        this.form =
            document.getElementById("categoryForm");

        this.saveButton =
            this.form?.querySelector(
                '[type="submit"]'
            );

    }


    /*======================================================
      Initialize
    ======================================================*/

    init() {

        if (!this.form) return;

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

                this.save();

            }
        );


        const cancelButton =
            document.getElementById(
                "cancelBtn"
            );


        cancelButton?.addEventListener(
            "click",
            () => this.cancel()
        );


        const previewButton =
            document.getElementById(
                "previewBtn"
            );


        previewButton?.addEventListener(
            "click",
            () => this.preview()
        );

    }


    /*======================================================
      Collect Form Data
    ======================================================*/

    collectData() {

        const seoTitle =
            document.getElementById(
                "seoTitle"
            );

        const seoDescription =
            document.getElementById(
                "seoDescription"
            );

        const seoKeywords =
            document.getElementById(
                "seoKeywords"
            );

        const canonicalUrl =
            document.getElementById(
                "canonicalUrl"
            );

        const seoIndex =
            document.getElementById(
                "seoIndex"
            );


        return {

            name:
                document
                    .getElementById(
                        "categoryName"
                    )
                    ?.value
                    .trim() || "",


            slug:
                document
                    .getElementById(
                        "categorySlug"
                    )
                    ?.value
                    .trim() || "",


            description:
                document
                    .getElementById(
                        "categoryDescription"
                    )
                    ?.value
                    .trim() || "",


            sortOrder:
                document
                    .getElementById(
                        "sortOrder"
                    )
                    ?.value || 0,


            parent:
                document
                    .getElementById(
                        "categoryParent"
                    )
                    ?.value || null,


            status:
                document
                    .getElementById(
                        "categoryStatus"
                    )
                    ?.value || "draft",


            featured:
                document
                    .getElementById(
                        "categoryFeatured"
                    )
                    ?.checked || false,


            seo: {

                title:
                    seoTitle
                        ?.value
                        .trim() || "",

                description:
                    seoDescription
                        ?.value
                        .trim() || "",

                keywords:
                    seoKeywords
                        ?.value
                        .trim() || "",

                canonical:
                    canonicalUrl
                        ?.value
                        .trim() || "",

                index:
                    seoIndex
                        ?.checked ?? true

            },


            image: null,


            createdAt:
                new Date().toISOString(),


            updatedAt:
                new Date().toISOString()

        };

    }


    /*======================================================
      Save
    ======================================================*/

    async save() {

        const data =
            this.collectData();


        try {

            this.setSavingState(true);

            loader?.show?.();


            /*
             * The validation module is responsible
             * for validating the collected data.
             *
             * index.js will run validation before
             * calling this method.
             */


            const response =
                await API.post(
                    "/categories",
                    data
                );


            if (!response) {

                throw new Error(
                    "Category could not be created."
                );

            }


            notification?.success?.(
                "Category created successfully."
            );


            /*
             * Small delay allows the success
             * notification to be visible before
             * navigation.
             */

            setTimeout(
                () => {

                    window.location.href =
                        "categories.html";

                },
                500
            );

        }

        catch (error) {

            console.error(
                "Category save error:",
                error
            );


            notification?.error?.(
                error?.message ||
                "Unable to save category."
            );

        }

        finally {

            loader?.hide?.();

            this.setSavingState(false);

        }

    }


    /*======================================================
      Saving State
    ======================================================*/

    setSavingState(saving) {

        if (!this.saveButton) return;


        this.saveButton.disabled =
            saving;


        this.saveButton.dataset.originalText ??=
            this.saveButton.textContent;


        this.saveButton.textContent =
            saving
                ? "Saving..."
                : this.saveButton.dataset
                    .originalText;

    }


    /*======================================================
      Preview
    ======================================================*/

    preview() {

        const data =
            this.collectData();


        sessionStorage.setItem(
            "nexpage_category_preview",
            JSON.stringify(data)
        );


        /*
         * Preview page will be connected later.
         * For now we provide a clear message
         * instead of navigating to a missing page.
         */

        notification?.info?.(
            "Category preview will be available after the storefront category page is connected."
        );

    }


    /*======================================================
      Cancel
    ======================================================*/

    async cancel() {

        const shouldLeave =
            await this.askConfirmation();


        if (!shouldLeave) return;


        window.location.href =
            "categories.html";

    }


    /*======================================================
      Confirm Cancel
    ======================================================*/

    async askConfirmation() {

        /*
         * If the shared confirm module exposes
         * confirm(), use it.
         *
         * Otherwise fall back safely.
         */

        if (
            confirm &&
            typeof confirm.confirm === "function"
        ) {

            return await confirm.confirm({

                title:
                    "Discard Category?",

                message:
                    "Any unsaved changes will be lost.",

                confirmText:
                    "Discard",

                cancelText:
                    "Continue"

            });

        }


        return window.confirm(
            "Discard this category? Any unsaved changes will be lost."
        );

    }

}


export default new CategorySave();