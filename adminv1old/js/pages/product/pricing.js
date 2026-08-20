/*==========================================================
  NexPage Commerce Platform

  File: pricing.js
  Description: Product Pricing Manager

  Module: Catalog / Products

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

class ProductPricing {

    constructor() {

        /*======================================
          Pricing Fields
        ======================================*/

        this.price = document.getElementById("productPrice");

        this.comparePrice = document.getElementById("productComparePrice");

        this.costPrice = document.getElementById("productCostPrice");

        this.taxable = document.getElementById("productTaxable");

        this.taxClass = document.getElementById("productTaxClass");

        this.profit = document.getElementById("productProfit");

        this.margin = document.getElementById("productMargin");

    }

    /*======================================================
      Initialize
    ======================================================*/

    init() {

        this.bindEvents();

        this.calculate();

    }

    /*======================================================
      Events
    ======================================================*/

    bindEvents() {

        this.price?.addEventListener("input", () => {

            this.calculate();

        });

        this.costPrice?.addEventListener("input", () => {

            this.calculate();

        });

    }

    /*======================================================
      Calculate
    ======================================================*/

    calculate() {

        const selling = Number(this.price?.value || 0);

        const cost = Number(this.costPrice?.value || 0);

        const profit = selling - cost;

        const margin = selling > 0

            ? (profit / selling) * 100

            : 0;

        if (this.profit) {

            this.profit.value = profit.toFixed(2);

        }

        if (this.margin) {

            this.margin.value = margin.toFixed(2);

        }

    }

    /*======================================================
      Validation
    ======================================================*/

    validate() {

        const price = Number(this.price?.value || 0);

        if (price < 0) {

            return {

                valid: false,

                message: "Selling price cannot be negative."

            };

        }

        const cost = Number(this.costPrice?.value || 0);

        if (cost < 0) {

            return {

                valid: false,

                message: "Cost price cannot be negative."

            };

        }

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

            price: Number(this.price?.value || 0),

            comparePrice: Number(this.comparePrice?.value || 0),

            costPrice: Number(this.costPrice?.value || 0),

            taxable: this.taxable?.checked || false,

            taxClass: this.taxClass?.value || "",

            profit: Number(this.profit?.value || 0),

            margin: Number(this.margin?.value || 0)

        };

    }

    /*======================================================
      Set Data
    ======================================================*/

    setData(product = {}) {

        if (this.price)

            this.price.value = product.price || "";

        if (this.comparePrice)

            this.comparePrice.value = product.comparePrice || "";

        if (this.costPrice)

            this.costPrice.value = product.costPrice || "";

        if (this.taxable)

            this.taxable.checked = product.taxable || false;

        if (this.taxClass)

            this.taxClass.value = product.taxClass || "";

        this.calculate();

    }

    /*======================================================
      Reset
    ======================================================*/

    reset() {

        this.setData({});

    }

}

export default new ProductPricing();