/*==========================================================
  Fashion Essentials Admin V1
  File: pagination.js
  Module: Products
  Description: Product Pagination
  Version: 2.1
==========================================================*/

export class ProductPagination {

    constructor(page) {

        this.page = page;

        this.pageSize = document.getElementById("pageSize");

        this.pageNumbers = document.getElementById("pageNumbers");

        this.firstButton = document.getElementById("firstPage");

        this.previousButton = document.getElementById("prevPage");

        this.nextButton = document.getElementById("nextPage");

        this.lastButton = document.getElementById("lastPage");

    }

    init() {

        this.bindEvents();

    }

    bindEvents() {

        if (this.pageSize) {

            this.pageSize.value = this.page.state.pageSize;

            this.pageSize.addEventListener("change", () => {

                this.page.state.pageSize = Number(this.pageSize.value);

                this.reset();

            });

        }

        this.firstButton?.addEventListener("click", () => {

            if (this.page.state.currentPage === 1) return;

            this.page.state.currentPage = 1;

            this.page.refresh();

        });

        this.previousButton?.addEventListener("click", () => {

            if (this.page.state.currentPage <= 1) return;

            this.page.state.currentPage--;

            this.page.refresh();

        });

        this.nextButton?.addEventListener("click", () => {

            if (this.page.state.currentPage >= this.page.state.totalPages) return;

            this.page.state.currentPage++;

            this.page.refresh();

        });

        this.lastButton?.addEventListener("click", () => {

            if (this.page.state.currentPage === this.page.state.totalPages) return;

            this.page.state.currentPage = this.page.state.totalPages;

            this.page.refresh();

        });

    }

    getProducts() {

        const start = (this.page.state.currentPage - 1) * this.page.state.pageSize;

        const end = start + this.page.state.pageSize;

        return this.page.state.filteredProducts.slice(start, end);

    }

    render() {

        const totalProducts = this.page.state.filteredProducts.length;

        this.page.state.totalPages = Math.max(

            1,

            Math.ceil(totalProducts / this.page.state.pageSize)

        );

        if (this.page.state.currentPage > this.page.state.totalPages) {

            this.page.state.currentPage = this.page.state.totalPages;

        }

        this.renderPageNumbers();

        this.updateButtons();

    }

    renderPageNumbers() {

        if (!this.pageNumbers) return;

        this.pageNumbers.innerHTML = "";

        for (

            let page = 1;

            page <= this.page.state.totalPages;

            page++

        ) {

            const button = document.createElement("button");

            button.type = "button";

            button.className =

                page === this.page.state.currentPage

                    ? "btn btn-primary"

                    : "btn btn-outline";

            button.textContent = page;

            button.addEventListener("click", () => {

                this.page.state.currentPage = page;

                this.page.refresh();

            });

            this.pageNumbers.appendChild(button);

        }

    }

    updateButtons() {

        if (this.firstButton) {

            this.firstButton.disabled =

                this.page.state.currentPage === 1;

        }

        if (this.previousButton) {

            this.previousButton.disabled =

                this.page.state.currentPage === 1;

        }

        if (this.nextButton) {

            this.nextButton.disabled =

                this.page.state.currentPage ===

                this.page.state.totalPages;

        }

        if (this.lastButton) {

            this.lastButton.disabled =

                this.page.state.currentPage ===

                this.page.state.totalPages;

        }

    }

    reset() {

        this.page.state.currentPage = 1;

        this.page.refresh();

    }

}