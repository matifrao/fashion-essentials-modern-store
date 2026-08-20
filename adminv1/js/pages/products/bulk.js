/*==========================================================
  Fashion Essentials Admin V1
  File: bulk.js
  Module: Products
  Description: Bulk Actions
  Version: 2.1
==========================================================*/

import API from "../../core/api.js";

export class ProductBulk {

    constructor(page) {

        this.page = page;

        this.selectAll = document.getElementById("selectAll");

        this.bulkBar = document.getElementById("bulkActions");

        this.selectedCount = document.getElementById("selectedCount");

        this.bulkDelete = document.getElementById("bulkDeleteBtn");

        this.bulkActive = document.getElementById("bulkActiveBtn");

        this.bulkDraft = document.getElementById("bulkDraftBtn");

    }

    init() {

        this.bindToolbar();

    }

    bindToolbar() {

        this.selectAll?.addEventListener("change", () => {

            this.toggleAll(this.selectAll.checked);

        });

        this.bulkDelete?.addEventListener("click", () => {

            this.deleteSelected();

        });

        this.bulkActive?.addEventListener("click", () => {

            this.changeStatus("Active");

        });

        this.bulkDraft?.addEventListener("click", () => {

            this.changeStatus("Draft");

        });

    }

    bindRows() {

        document.querySelectorAll(".row-checkbox").forEach((checkbox) => {

            checkbox.addEventListener("change", () => {

                const id = checkbox.dataset.id;

                if (checkbox.checked) {

                    this.page.state.selectedProducts.add(id);

                } else {

                    this.page.state.selectedProducts.delete(id);

                }

                this.update();

            });

        });

    }

    toggleAll(checked) {

        this.page.state.selectedProducts.clear();

        document.querySelectorAll(".row-checkbox").forEach((checkbox) => {

            checkbox.checked = checked;

            if (checked) {

                this.page.state.selectedProducts.add(checkbox.dataset.id);

            }

        });

        this.update();

    }

    update() {

        const count = this.page.state.selectedProducts.size;

        if (this.selectedCount) {

            this.selectedCount.textContent = count;

        }

        if (this.bulkBar) {

            this.bulkBar.hidden = count === 0;

        }

        if (this.selectAll) {

            const total = document.querySelectorAll(".row-checkbox").length;

            this.selectAll.checked = total > 0 && total === count;

        }

    }

    async deleteSelected() {

        const ids = [...this.page.state.selectedProducts];

        if (!ids.length) return;

        if (!confirm(`Delete ${ids.length} selected products?`)) {

            return;

        }

        try {

            await Promise.all(

                ids.map(id => API.delete(`/products/${id}`))

            );

            this.page.state.selectedProducts.clear();

            await this.page.loadProducts();

            this.page.refresh();

        }

        catch (error) {

            console.error(error);

            alert("Unable to delete selected products.");

        }

    }

    async changeStatus(status) {

        const ids = [...this.page.state.selectedProducts];

        if (!ids.length) return;

        try {

            await Promise.all(

                ids.map(id =>

                    API.patch(`/products/${id}`, {

                        status

                    })

                )

            );

            this.page.state.selectedProducts.clear();

            await this.page.loadProducts();

            this.page.refresh();

        }

        catch (error) {

            console.error(error);

            alert("Unable to update product status.");

        }

    }

}