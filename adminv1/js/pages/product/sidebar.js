/*==========================================================
  NexPage Commerce Platform

  File: sidebar.js
  Description: Product Sidebar Manager

  Module: Catalog / Products

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

class ProductSidebar {

    constructor() {

        /*======================================
          Publish
        ======================================*/

        this.status = document.getElementById("productStatus");

        this.visibility = document.getElementById("productVisibility");

        this.featured = document.getElementById("productFeatured");

        /*======================================
          Category & Brand
        ======================================*/

        this.category = document.getElementById("productCategory");

        this.brand = document.getElementById("productBrand");

        this.tags = document.getElementById("productTags");

        /*======================================
          Featured Image
        ======================================*/

        this.featuredImage = document.getElementById("featuredImage");

    }

    /*======================================================
      Initialize
    ======================================================*/

    init() {

        this.bindEvents();

    }

    /*======================================================
      Events
    ======================================================*/

    bindEvents() {

        // Reserved for future enhancements

    }

    /*======================================================
      Validation
    ======================================================*/

    validate() {

        return {

            valid: true,

            message: ""

        };

    }

    /*======================================================
      Get Data
    ======================================================*/

    getData() {

        return {

            status: this.status?.value || "draft",

            visibility: this.visibility?.value || "public",

            category: this.category?.value || "",

            brand: this.brand?.value || "",

            tags: this.parseTags(),

            featured: this.featured?.checked || false,

            featuredImage: this.featuredImage?.value || ""

        };

    }

    /*======================================================
      Set Data
    ======================================================*/

    setData(product = {}) {

        if (this.status)

            this.status.value = product.status || "draft";

        if (this.visibility)

            this.visibility.value = product.visibility || "public";

        if (this.category)

            this.category.value = product.category || "";

        if (this.brand)

            this.brand.value = product.brand || "";

        if (this.tags)

            this.tags.value = (product.tags || []).join(", ");

        if (this.featured)

            this.featured.checked = product.featured || false;

        if (this.featuredImage)

            this.featuredImage.value = product.featuredImage || "";

    }

    /*======================================================
      Reset
    ======================================================*/

    reset() {

        this.setData({});

    }

    /*======================================================
      Tags
    ======================================================*/

    parseTags() {

        if (!this.tags || !this.tags.value.trim()) {

            return [];

        }

        return this.tags.value

            .split(",")

            .map(tag => tag.trim())

            .filter(tag => tag.length);

    }

}

export default new ProductSidebar();