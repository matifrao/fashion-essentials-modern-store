/*==========================================================
  NexPage Commerce Platform

  File: seo.js
  Description: Category SEO Manager

  Module: Categories

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

class CategorySEO {

    constructor() {

        this.card = document.getElementById("seoCard");

    }


    /*======================================================
      Initialize
    ======================================================*/

    init() {

        if (!this.card) return;

        this.render();

        this.cacheElements();

        this.bindEvents();

        this.updateCounters();

    }


    /*======================================================
      Render
    ======================================================*/

    render() {

        this.card.innerHTML = `

            <div class="card__header">

                <h2>

                    Search Engine Optimization

                </h2>

            </div>


            <div class="card__body">

                <div class="form-grid">


                    <!-- Meta Title -->

                    <div class="form-group form-group--full">

                        <label for="seoTitle">

                            SEO Title

                            <span class="required">*</span>

                        </label>

                        <input
                            id="seoTitle"
                            name="seoTitle"
                            type="text"
                            maxlength="60"
                            placeholder="Hijabs | Fashion Essentials">

                        <small
                            class="form-help"
                            id="seoTitleCounter">

                            0 / 60 characters

                        </small>

                    </div>


                    <!-- Meta Description -->

                    <div class="form-group form-group--full">

                        <label for="seoDescription">

                            Meta Description

                        </label>

                        <textarea
                            id="seoDescription"
                            name="seoDescription"
                            rows="5"
                            maxlength="160"
                            placeholder="Shop elegant hijabs designed for comfort, coverage and everyday modest fashion.">

                        </textarea>

                        <small
                            class="form-help"
                            id="seoDescriptionCounter">

                            0 / 160 characters

                        </small>

                    </div>


                    <!-- Keywords -->

                    <div class="form-group form-group--full">

                        <label for="seoKeywords">

                            SEO Keywords

                        </label>

                        <input
                            id="seoKeywords"
                            name="seoKeywords"
                            type="text"
                            placeholder="hijabs, modest fashion, women's hijab">

                        <small class="form-help">

                            Separate keywords with commas.

                        </small>

                    </div>


                    <!-- Canonical URL -->

                    <div class="form-group form-group--full">

                        <label for="canonicalUrl">

                            Canonical URL

                        </label>

                        <input
                            id="canonicalUrl"
                            name="canonicalUrl"
                            type="url"
                            placeholder="https://example.com/category/hijabs">

                    </div>


                    <!-- Search Engine Visibility -->

                    <div class="form-group form-group--full">

                        <div class="checkbox-group">

                            <input
                                id="seoIndex"
                                name="seoIndex"
                                type="checkbox"
                                checked>

                            <label for="seoIndex">

                                Allow search engines to index this category

                            </label>

                        </div>

                    </div>

                </div>

            </div>

        `;

    }


    /*======================================================
      Cache Elements
    ======================================================*/

    cacheElements() {

        this.title = document.getElementById(
            "seoTitle"
        );

        this.description = document.getElementById(
            "seoDescription"
        );

        this.keywords = document.getElementById(
            "seoKeywords"
        );

        this.canonical = document.getElementById(
            "canonicalUrl"
        );

        this.index = document.getElementById(
            "seoIndex"
        );

        this.titleCounter = document.getElementById(
            "seoTitleCounter"
        );

        this.descriptionCounter = document.getElementById(
            "seoDescriptionCounter"
        );

    }


    /*======================================================
      Events
    ======================================================*/

    bindEvents() {

        this.title?.addEventListener(
            "input",
            () => this.updateCounters()
        );

        this.description?.addEventListener(
            "input",
            () => this.updateCounters()
        );

    }


    /*======================================================
      Character Counters
    ======================================================*/

    updateCounters() {

        if (this.title && this.titleCounter) {

            this.titleCounter.textContent =
                `${this.title.value.length} / 60 characters`;

        }


        if (
            this.description &&
            this.descriptionCounter
        ) {

            this.descriptionCounter.textContent =
                `${this.description.value.length} / 160 characters`;

        }

    }


    /*======================================================
      Get Data
    ======================================================*/

    getData() {

        return {

            title: this.title?.value.trim() || "",

            description:
                this.description?.value.trim() || "",

            keywords:
                this.keywords?.value.trim() || "",

            canonical:
                this.canonical?.value.trim() || "",

            index:
                this.index?.checked ?? true

        };

    }

}


export default new CategorySEO();