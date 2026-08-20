/*==========================================================
  NexPage Commerce Platform

  File: validation.js
  Description: Category Form Validation

  Module: Categories

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

import validator from "../../core/validator.js";


class CategoryValidation {

    /*======================================================
      Validate Category
    ======================================================*/

    validate(data = {}) {

        const errors = {};


        /*==================================================
          Category Name
        ==================================================*/

        if (!validator.required(data.name)) {

            errors.name =
                "Category name is required.";

        }

        else if (
            !validator.betweenLength(
                data.name,
                2,
                100
            )
        ) {

            errors.name =
                "Category name must be between 2 and 100 characters.";

        }


        /*==================================================
          Slug
        ==================================================*/

        if (data.slug) {

            if (!validator.slug(data.slug)) {

                errors.slug =
                    "Slug may contain lowercase letters, numbers and hyphens only.";

            }

        }


        /*==================================================
          Sort Order
        ==================================================*/

        if (
            data.sortOrder !== "" &&
            data.sortOrder !== undefined &&
            data.sortOrder !== null
        ) {

            if (!validator.integer(data.sortOrder)) {

                errors.sortOrder =
                    "Sort order must be a whole number.";

            }

            else if (
                !validator.positive(data.sortOrder)
            ) {

                errors.sortOrder =
                    "Sort order cannot be negative.";

            }

        }


        /*==================================================
          SEO Title
        ==================================================*/

        if (data.seo?.title) {

            if (
                !validator.maxLength(
                    data.seo.title,
                    60
                )
            ) {

                errors.seoTitle =
                    "SEO title must not exceed 60 characters.";

            }

        }


        /*==================================================
          SEO Description
        ==================================================*/

        if (data.seo?.description) {

            if (
                !validator.maxLength(
                    data.seo.description,
                    160
                )
            ) {

                errors.seoDescription =
                    "SEO description must not exceed 160 characters.";

            }

        }


        /*==================================================
          Canonical URL
        ==================================================*/

        if (data.seo?.canonical) {

            if (
                !validator.url(
                    data.seo.canonical
                )
            ) {

                errors.canonical =
                    "Please enter a valid canonical URL.";

            }

        }


        return {

            valid:
                Object.keys(errors).length === 0,

            errors

        };

    }


    /*======================================================
      First Error
    ======================================================*/

    firstError(errors = {}) {

        const keys = Object.keys(errors);

        if (!keys.length) return null;

        return errors[keys[0]];

    }


    /*======================================================
      Display Errors
    ======================================================*/

    displayErrors(errors = {}) {

        this.clearErrors();


        Object.entries(errors).forEach(
            ([field, message]) => {

                const element =
                    document.getElementById(
                        this.getFieldId(field)
                    );

                if (!element) return;


                element.classList.add(
                    "is-invalid"
                );


                element.setAttribute(
                    "aria-invalid",
                    "true"
                );


                let errorElement =
                    document.getElementById(
                        `${element.id}Error`
                    );


                if (!errorElement) {

                    errorElement =
                        document.createElement(
                            "small"
                        );

                    errorElement.id =
                        `${element.id}Error`;

                    errorElement.className =
                        "form-error";

                    element.parentElement
                        ?.appendChild(
                            errorElement
                        );

                }


                errorElement.textContent =
                    message;

            }
        );

    }


    /*======================================================
      Clear Errors
    ======================================================*/

    clearErrors() {

        document
            .querySelectorAll(
                ".is-invalid"
            )
            .forEach(element => {

                element.classList.remove(
                    "is-invalid"
                );

                element.removeAttribute(
                    "aria-invalid"
                );

            });


        document
            .querySelectorAll(
                ".form-error"
            )
            .forEach(element => {

                element.remove();

            });

    }


    /*======================================================
      Field Mapping
    ======================================================*/

    getFieldId(field) {

        const fields = {

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


        return fields[field] || field;

    }

}


export default new CategoryValidation();