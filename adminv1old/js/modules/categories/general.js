/*==========================================================
  NexPage Commerce Platform

  File: general.js
  Description: Category General Information

  Module: Categories

  Version: 1.0.0

  Copyright © NexPage.
==========================================================*/

class CategoryGeneral {

    constructor() {

        this.card = document.getElementById("generalCard");

    }

    init() {

        if (!this.card) return;

        this.render();

    }

    render() {

        this.card.innerHTML = `

            <div class="card__header">

                <h2>

                    General Information

                </h2>

            </div>

            <div class="card__body">

                <div class="form-grid">

                    <div class="form-group form-group--full">

                        <label for="categoryName">

                            Category Name

                            <span class="required">*</span>

                        </label>

                        <input
                            id="categoryName"
                            name="categoryName"
                            type="text"
                            placeholder="Hijabs"
                            required>

                    </div>

                    <div class="form-group">

                        <label for="categorySlug">

                            URL Slug

                        </label>

                        <input
                            id="categorySlug"
                            name="categorySlug"
                            type="text"
                            placeholder="hijabs">

                    </div>

                    <div class="form-group">

                        <label for="sortOrder">

                            Sort Order

                        </label>

                        <input
                            id="sortOrder"
                            name="sortOrder"
                            type="number"
                            value="0"
                            min="0">

                    </div>

                    <div class="form-group form-group--full">

                        <label for="categoryDescription">

                            Description

                        </label>

                        <textarea
                            id="categoryDescription"
                            rows="6"
                            placeholder="Category description..."></textarea>

                    </div>

                </div>

            </div>

        `;

    }

}

export default new CategoryGeneral();