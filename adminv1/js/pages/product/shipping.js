/*==========================================================
  NexPage Commerce Platform

  File: shipping.js
  Description: Product Shipping Manager

  Module: Catalog / Products

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

class ProductShipping {

    constructor() {

        /*======================================
          Shipping Fields
        ======================================*/

        this.requiresShipping = document.getElementById("requiresShipping");

        this.freeShipping = document.getElementById("freeShipping");

        this.shippingClass = document.getElementById("shippingClass");

        this.packageType = document.getElementById("packageType");

        /*======================================
          Weight
        ======================================*/

        this.weight = document.getElementById("productWeight");

        this.weightUnit = document.getElementById("weightUnit");

        /*======================================
          Dimensions
        ======================================*/

        this.length = document.getElementById("productLength");

        this.width = document.getElementById("productWidth");

        this.height = document.getElementById("productHeight");

        this.dimensionUnit = document.getElementById("dimensionUnit");

        /*======================================
          Extra Shipping
        ======================================*/

        this.fragile = document.getElementById("isFragile");

        this.cod = document.getElementById("cashOnDelivery");

        this.oversized = document.getElementById("oversizedPackage");

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

        this.requiresShipping?.addEventListener("change", () => {

            this.toggleFields();

        });

        this.toggleFields();

    }

    /*======================================================
      Enable / Disable Shipping Fields
    ======================================================*/

    toggleFields() {

        const enabled = this.requiresShipping?.checked ?? true;

        [

            this.freeShipping,

            this.shippingClass,

            this.packageType,

            this.weight,

            this.weightUnit,

            this.length,

            this.width,

            this.height,

            this.dimensionUnit,

            this.fragile,

            this.cod,

            this.oversized

        ].forEach(field => {

            if (field) {

                field.disabled = !enabled;

            }

        });

    }

    /*======================================================
      Validation
    ======================================================*/

    validate() {

        if (!(this.requiresShipping?.checked)) {

            return {

                valid: true,

                message: ""

            };

        }

        const weight = Number(this.weight?.value || 0);

        if (weight < 0) {

            return {

                valid: false,

                message: "Weight cannot be negative."

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

            requiresShipping: this.requiresShipping?.checked || false,

            freeShipping: this.freeShipping?.checked || false,

            shippingClass: this.shippingClass?.value || "",

            packageType: this.packageType?.value || "",

            weight: Number(this.weight?.value || 0),

            weightUnit: this.weightUnit?.value || "kg",

            dimensions: {

                length: Number(this.length?.value || 0),

                width: Number(this.width?.value || 0),

                height: Number(this.height?.value || 0),

                unit: this.dimensionUnit?.value || "cm"

            },

            fragile: this.fragile?.checked || false,

            cashOnDelivery: this.cod?.checked || false,

            oversized: this.oversized?.checked || false

        };

    }

    /*======================================================
      Set Data
    ======================================================*/

    setData(product = {}) {

        if (this.requiresShipping)

            this.requiresShipping.checked = product.requiresShipping ?? true;

        if (this.freeShipping)

            this.freeShipping.checked = product.freeShipping || false;

        if (this.shippingClass)

            this.shippingClass.value = product.shippingClass || "";

        if (this.packageType)

            this.packageType.value = product.packageType || "";

        if (this.weight)

            this.weight.value = product.weight || "";

        if (this.weightUnit)

            this.weightUnit.value = product.weightUnit || "kg";

        if (this.length)

            this.length.value = product.dimensions?.length || "";

        if (this.width)

            this.width.value = product.dimensions?.width || "";

        if (this.height)

            this.height.value = product.dimensions?.height || "";

        if (this.dimensionUnit)

            this.dimensionUnit.value = product.dimensions?.unit || "cm";

        if (this.fragile)

            this.fragile.checked = product.fragile || false;

        if (this.cod)

            this.cod.checked = product.cashOnDelivery || false;

        if (this.oversized)

            this.oversized.checked = product.oversized || false;

        this.toggleFields();

    }

    /*======================================================
      Reset
    ======================================================*/

    reset() {

        this.setData({});

    }

}

export default new ProductShipping();