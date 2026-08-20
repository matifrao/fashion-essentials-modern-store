/*==========================================================
  NexPage Commerce Platform

  File: seo.js
  Description: SEO Manager

  Module: SEO

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

class SeoManager {

    constructor() {

        /*======================================
          SEO Fields
        ======================================*/

        this.metaTitle = document.getElementById("metaTitle");

        this.metaDescription = document.getElementById("metaDescription");

        this.metaKeywords = document.getElementById("metaKeywords");

        this.canonicalUrl = document.getElementById("canonicalUrl");

        this.focusKeyword = document.getElementById("focusKeyword");

        this.metaRobots = document.getElementById("metaRobots");

        this.openGraphTitle = document.getElementById("ogTitle");

        this.openGraphDescription = document.getElementById("ogDescription");

        this.openGraphImage = document.getElementById("ogImage");

        this.twitterTitle = document.getElementById("twitterTitle");

        this.twitterDescription = document.getElementById("twitterDescription");

        this.twitterImage = document.getElementById("twitterImage");

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

        this.metaTitle?.addEventListener("input", () => {

            this.limitLength(this.metaTitle, 60);

        });

        this.metaDescription?.addEventListener("input", () => {

            this.limitLength(this.metaDescription, 160);

        });

    }

    /*======================================================
      Character Limits
    ======================================================*/

    limitLength(field, max) {

        if (!field) return;

        if (field.value.length > max) {

            field.value = field.value.substring(0, max);

        }

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

            metaTitle: this.metaTitle?.value.trim() || "",

            metaDescription: this.metaDescription?.value.trim() || "",

            metaKeywords: this.metaKeywords?.value.trim() || "",

            canonicalUrl: this.canonicalUrl?.value.trim() || "",

            focusKeyword: this.focusKeyword?.value.trim() || "",

            robots: this.metaRobots?.value || "index,follow",

            openGraph: {

                title: this.openGraphTitle?.value.trim() || "",

                description: this.openGraphDescription?.value.trim() || "",

                image: this.openGraphImage?.value.trim() || ""

            },

            twitter: {

                title: this.twitterTitle?.value.trim() || "",

                description: this.twitterDescription?.value.trim() || "",

                image: this.twitterImage?.value.trim() || ""

            }

        };

    }

    /*======================================================
      Set Data
    ======================================================*/

    setData(data = {}) {

        if (this.metaTitle)

            this.metaTitle.value = data.metaTitle || "";

        if (this.metaDescription)

            this.metaDescription.value = data.metaDescription || "";

        if (this.metaKeywords)

            this.metaKeywords.value = data.metaKeywords || "";

        if (this.canonicalUrl)

            this.canonicalUrl.value = data.canonicalUrl || "";

        if (this.focusKeyword)

            this.focusKeyword.value = data.focusKeyword || "";

        if (this.metaRobots)

            this.metaRobots.value = data.robots || "index,follow";

        if (this.openGraphTitle)

            this.openGraphTitle.value = data.openGraph?.title || "";

        if (this.openGraphDescription)

            this.openGraphDescription.value = data.openGraph?.description || "";

        if (this.openGraphImage)

            this.openGraphImage.value = data.openGraph?.image || "";

        if (this.twitterTitle)

            this.twitterTitle.value = data.twitter?.title || "";

        if (this.twitterDescription)

            this.twitterDescription.value = data.twitter?.description || "";

        if (this.twitterImage)

            this.twitterImage.value = data.twitter?.image || "";

    }

    /*======================================================
      Reset
    ======================================================*/

    reset() {

        this.setData({});

    }

}

export default new SeoManager();