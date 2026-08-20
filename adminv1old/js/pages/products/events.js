/*==========================================================
  Fashion Essentials Admin V1
  File: events.js
  Module: Products
  Description: Products Page Events
  Version: 2.1
==========================================================*/

export class ProductEvents {

    constructor(page) {

        this.page = page;

        this.addButton = document.getElementById("addProductBtn");

        this.refreshButton = document.getElementById("refreshProductsBtn");

        this.exportButton = document.getElementById("exportProductsBtn");

    }

    init() {

        this.bindEvents();

    }

    bindEvents() {

        this.bindAdd();

        this.bindRefresh();

        this.bindExport();

    }

    bindAdd() {

        if (!this.addButton) return;

        this.addButton.addEventListener("click", () => {

            window.location.href = "product-add.html";

        });

    }

    bindRefresh() {

        if (!this.refreshButton) return;

        this.refreshButton.addEventListener("click", async () => {

            this.refreshButton.disabled = true;

            try {

                await this.page.loadProducts();

                if (this.page.filters) {

                    this.page.filters.refresh();

                }

                this.page.refresh();

            }

            catch (error) {

                console.error(error);

            }

            finally {

                this.refreshButton.disabled = false;

            }

        });

    }

    bindExport() {

        if (!this.exportButton) return;

        this.exportButton.addEventListener("click", () => {

            this.exportCSV();

        });

    }

    exportCSV() {

        const products = this.page.state.filteredProducts;

        if (!products.length) {

            alert("No products available to export.");

            return;

        }

        const rows = [

            [
                "Name",
                "SKU",
                "Category",
                "Brand",
                "Price",
                "Stock",
                "Status"
            ]

        ];

        products.forEach(product => {

            rows.push([

                product.name || "",

                product.sku || "",

                product.category || "",

                product.brand || "",

                product.price || 0,

                product.stock || 0,

                product.status || ""

            ]);

        });

        const csv = rows

            .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(","))

            .join("\n");

        const blob = new Blob(

            [csv],

            {

                type: "text/csv;charset=utf-8;"

            }

        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = "products.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    }

}