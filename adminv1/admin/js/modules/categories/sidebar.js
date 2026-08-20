/*==========================================================
  NexPage Commerce Platform

  File: sidebar.js
  Description: Category Sidebar Manager

  Module: Categories

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

import API from "../../core/api.js";


class CategorySidebar {

    constructor() {

        this.publishCard =
            document.getElementById("publishCard");

        this.statusCard =
            document.getElementById("statusCard");

        this.parentCard =
            document.getElementById("parentCard");

    }


    /*======================================================
      Initialize
    ======================================================*/

    async init() {

        if (
            !this.publishCard &&
            !this.statusCard &&
            !this.parentCard
        ) {

            return;

        }

        this.renderPublish();

        this.renderStatus();

        await this.renderParent();

    }


    /*======================================================
      Publish
    ======================================================*/

    renderPublish() {

        if (!this.publishCard) return;

        this.publishCard.innerHTML = `

            <div class="card__header">

                <h2>

                    Publish

                </h2>

            </div>

            <div class="card__body">

                <div class="publish-actions">

                    <button
                        type="submit"
                        form="categoryForm"
                        class="btn btn-primary">

                        Save Category

                    </button>

                    <button
                        type="button"
                        class="btn btn-outline"
                        id="sidebarPreviewBtn">

                        Preview

                    </button>

                </div>

            </div>

        `;

        const previewButton =
            document.getElementById(
                "sidebarPreviewBtn"
            );

        previewButton?.addEventListener(
            "click",
            () => {

                document
                    .getElementById("previewBtn")
                    ?.click();

            }
        );

    }


    /*======================================================
      Status
    ======================================================*/

    renderStatus() {

        if (!this.statusCard) return;

        this.statusCard.innerHTML = `

            <div class="card__header">

                <h2>

                    Status

                </h2>

            </div>

            <div class="card__body">

                <div class="form-group">

                    <label for="categoryStatus">

                        Category Status

                    </label>

                    <select
                        id="categoryStatus"
                        name="categoryStatus">

                        <option value="draft">

                            Draft

                        </option>

                        <option value="published">

                            Published

                        </option>

                        <option value="scheduled">

                            Scheduled

                        </option>

                    </select>

                </div>

            </div>

        `;

    }


    /*======================================================
      Parent Category
    ======================================================*/

    async renderParent() {

        if (!this.parentCard) return;

        this.parentCard.innerHTML = `

            <div class="card__header">

                <h2>

                    Parent Category

                </h2>

            </div>

            <div class="card__body">

                <div class="form-group">

                    <label for="categoryParent">

                        Parent Category

                    </label>

                    <select
                        id="categoryParent"
                        name="categoryParent">

                        <option value="">

                            None — Top Level Category

                        </option>

                    </select>

                </div>

            </div>

        `;

        await this.loadParentCategories();

    }


    /*======================================================
      Load Parent Categories
    ======================================================*/

    async loadParentCategories() {

        const select =
            document.getElementById(
                "categoryParent"
            );

        if (!select) return;

        try {

            const categories =
                await API.get(
                    "/categories"
                );

            if (
                !Array.isArray(categories)
            ) {

                return;

            }

            categories.forEach(
                category => {

                    if (
                        !category?.id &&
                        !category?.name
                    ) {

                        return;

                    }

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        category.id ??
                        category.name;

                    option.textContent =
                        category.name;

                    select.appendChild(
                        option
                    );

                }
            );

        }

        catch (error) {

            console.error(
                "Unable to load parent categories:",
                error
            );

        }

    }

}


export default new CategorySidebar();