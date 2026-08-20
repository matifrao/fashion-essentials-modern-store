/*==========================================================
  NexPage Commerce Platform

  File: inventory.js
  Description: Product Inventory Manager

  Module: Catalog / Products

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

class ProductInventory {

    constructor() {

        /*======================================
          Inventory Fields
        ======================================*/

        this.sku = document.getElementById("inventorySku");

        this.barcode = document.getElementById("inventoryBarcode");

        this.trackInventory = document.getElementById("trackInventory");

        this.stock = document.getElementById("productStock");

        this.reserved = document.getElementById("productReserved");

        this.available = document.getElementById("productAvailable");

        this.lowStock = document.getElementById("lowStockAlert");

        this.allowBackorders = document.getElementById("allowBackorders");

        this.stockStatus = document.getElementById("stockStatus");

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

        this.stock?.addEventListener("input", () => {

            this.calculate();

        });

        this.reserved?.addEventListener("input", () => {

            this.calculate();

        });

    }

    /*======================================================
      Calculate Inventory
    ======================================================*/

    calculate() {

        const stock = Number(this.stock?.value || 0);

        const reserved = Number(this.reserved?.value || 0);

        const available = Math.max(stock - reserved, 0);

        if (this.available) {

            this.available.value = available;

        }

        if (this.stockStatus) {

            if (available <= 0) {

                this.stockStatus.textContent = "Out of Stock";

            }

            else if (

                this.lowStock &&
                available <= Number(this.lowStock.value || 0)

            ) {

                this.stockStatus.textContent = "Low Stock";

            }

            else {

                this.stockStatus.textContent = "In Stock";

            }

        }

    }

    /*======================================================
      Validation
    ======================================================*/

    validate() {

        const stock = Number(this.stock?.value || 0);

        const reserved = Number(this.reserved?.value || 0);

        if (stock < 0) {

            return {

                valid: false,

                message: "Stock cannot be negative."

            };

        }

        if (reserved < 0) {

            return {

                valid: false,

                message: "Reserved quantity cannot be negative."

            };

        }

        if (reserved > stock) {

            return {

                valid: false,

                message: "Reserved quantity cannot exceed stock."

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

            sku: this.sku?.value.trim() || "",

            barcode: this.barcode?.value.trim() || "",

            trackInventory: this.trackInventory?.checked || false,

            stock: Number(this.stock?.value || 0),

            reserved: Number(this.reserved?.value || 0),

            available: Number(this.available?.value || 0),

            lowStockAlert: Number(this.lowStock?.value || 0),

            allowBackorders: this.allowBackorders?.checked || false

        };

    }

    /*======================================================
      Set Data
    ======================================================*/

    setData(product = {}) {

        if (this.sku)

            this.sku.value = product.sku || "";

        if (this.barcode)

            this.barcode.value = product.barcode || "";

        if (this.trackInventory)

            this.trackInventory.checked = product.trackInventory || false;

        if (this.stock)

            this.stock.value = product.stock || 0;

        if (this.reserved)

            this.reserved.value = product.reserved || 0;

        if (this.lowStock)

            this.lowStock.value = product.lowStockAlert || 5;

        if (this.allowBackorders)

            this.allowBackorders.checked = product.allowBackorders || false;

        this.calculate();

    }

    /*======================================================
      Reset
    ======================================================*/

    reset() {

        this.setData({});

    }

}

export default new ProductInventory();