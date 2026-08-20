/*==========================================================
  NexPage Commerce Platform

  File: index.js
  Description: Categories Module

  Module: Catalog / Categories

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

class Categories {

    constructor() {

        this.categories = [];

        this.currentCategory = null;

        this.form = document.getElementById("categoryForm");

        this.generalCard = document.getElementById("generalCard");
        this.imageCard = document.getElementById("imageCard");
        this.seoCard = document.getElementById("seoCard");
        this.publishCard = document.getElementById("publishCard");
        this.statusCard = document.getElementById("statusCard");
        this.parentCard = document.getElementById("parentCard");

    }

    init() {

        if (!this.form) return;

        this.renderForm();

        this.bindEvents();

    }

    /*==========================================================
      FORM RENDERING
    ==========================================================*/

    renderForm() {

        this.renderGeneral();
        this.renderImage();
        this.renderSEO();
        this.renderPublish();
        this.renderStatus();
        this.renderParent();

    }

    renderGeneral() {

        if (!this.generalCard) return;

        this.generalCard.innerHTML = `
            <div class="card__header">
                <div>
                    <h2>General Information</h2>
                    <p>Basic information about this category.</p>
                </div>
            </div>

            <div class="card__body">

                <div class="form-group">

                    <label for="categoryName">
                        Category Name
                        <span aria-hidden="true">*</span>
                    </label>

                    <input
                        type="text"
                        id="categoryName"
                        name="name"
                        class="form-control"
                        placeholder="e.g. Hijabs"
                        maxlength="120"
                        required
                    />

                    <small class="form-help">
                        Enter the name customers will see.
                    </small>

                    <div
                        class="form-error"
                        id="categoryNameError"
                        aria-live="polite"
                    ></div>

                </div>


                <div class="form-group">

                    <label for="categorySlug">
                        Slug
                        <span aria-hidden="true">*</span>
                    </label>

                    <input
                        type="text"
                        id="categorySlug"
                        name="slug"
                        class="form-control"
                        placeholder="e.g. hijabs"
                        maxlength="120"
                        required
                    />

                    <small class="form-help">
                        URL-friendly category identifier.
                    </small>

                    <div
                        class="form-error"
                        id="categorySlugError"
                        aria-live="polite"
                    ></div>

                </div>


                <div class="form-group">

                    <label for="categoryDescription">
                        Description
                    </label>

                    <textarea
                        id="categoryDescription"
                        name="description"
                        class="form-control"
                        rows="6"
                        maxlength="1000"
                        placeholder="Describe this category..."
                    ></textarea>

                    <small class="form-help">
                        Optional category description.
                    </small>

                </div>

            </div>
        `;

    }

    renderImage() {

        if (!this.imageCard) return;

        this.imageCard.innerHTML = `
            <div class="card__header">
                <div>
                    <h2>Category Image</h2>
                    <p>Add an image representing this category.</p>
                </div>
            </div>

            <div class="card__body">

                <div class="form-group">

                    <label for="categoryImage">
                        Image URL
                    </label>

                    <input
                        type="url"
                        id="categoryImage"
                        name="image"
                        class="form-control"
                        placeholder="https://..."
                    />

                    <small class="form-help">
                        Enter the image URL for this category.
                    </small>

                </div>

                <div
                    id="categoryImagePreview"
                    class="category-image-preview"
                    hidden
                >
                    <img
                        id="categoryImagePreviewImg"
                        src=""
                        alt="Category preview"
                    />

                    <button
                        type="button"
                        class="btn btn-secondary"
                        id="removeCategoryImage"
                    >
                        Remove Image
                    </button>
                </div>

            </div>
        `;

    }

    renderSEO() {

        if (!this.seoCard) return;

        this.seoCard.innerHTML = `
            <div class="card__header">
                <div>
                    <h2>SEO</h2>
                    <p>Search engine information for this category.</p>
                </div>
            </div>

            <div class="card__body">

                <div class="form-group">

                    <label for="seoTitle">
                        SEO Title
                    </label>

                    <input
                        type="text"
                        id="seoTitle"
                        name="seoTitle"
                        class="form-control"
                        maxlength="160"
                        placeholder="SEO title"
                    />

                    <small class="form-help">
                        Recommended: keep the title concise and relevant.
                    </small>

                </div>


                <div class="form-group">

                    <label for="seoDescription">
                        SEO Description
                    </label>

                    <textarea
                        id="seoDescription"
                        name="seoDescription"
                        class="form-control"
                        rows="5"
                        maxlength="320"
                        placeholder="SEO meta description"
                    ></textarea>

                </div>

            </div>
        `;

    }

    renderPublish() {

        if (!this.publishCard) return;

        this.publishCard.innerHTML = `
            <div class="card__header">
                <h2>Publish</h2>
            </div>

            <div class="card__body">

                <p class="form-help">
                    Save this category when all required information
                    has been completed.
                </p>

                <button
                    type="submit"
                    class="btn btn-primary btn-block"
                    id="saveCategoryBtn"
                >
                    Save Category
                </button>

            </div>
        `;

    }

    renderStatus() {

        if (!this.statusCard) return;

        this.statusCard.innerHTML = `
            <div class="card__header">
                <h2>Status</h2>
            </div>

            <div class="card__body">

                <div class="form-group">

                    <label for="categoryStatus">
                        Category Status
                    </label>

                    <select
                        id="categoryStatus"
                        name="status"
                        class="form-control"
                    >
                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>
                    </select>

                </div>

            </div>
        `;

    }

    renderParent() {

        if (!this.parentCard) return;

        this.parentCard.innerHTML = `
            <div class="card__header">
                <h2>Parent Category</h2>
            </div>

            <div class="card__body">

                <div class="form-group">

                    <label for="parentCategory">
                        Parent Category
                    </label>

                    <select
                        id="parentCategory"
                        name="parentId"
                        class="form-control"
                    >
                        <option value="">
                            No Parent — Top Level Category
                        </option>
                    </select>

                    <small class="form-help">
                        Select a parent if this is a subcategory.
                    </small>

                </div>

            </div>
        `;

    }

    /*==========================================================
      EVENTS
    ==========================================================*/

    bindEvents() {

        this.form.addEventListener(
            "submit",
            event => this.handleSubmit(event)
        );

        const cancelButton =
            document.getElementById("cancelBtn");

        if (cancelButton) {

            cancelButton.addEventListener(
                "click",
                () => this.handleCancel()
            );

        }

        const previewButton =
            document.getElementById("previewBtn");

        if (previewButton) {

            previewButton.addEventListener(
                "click",
                () => this.handlePreview()
            );

        }

        const nameInput =
            document.getElementById("categoryName");

        const slugInput =
            document.getElementById("categorySlug");

        if (nameInput && slugInput) {

            nameInput.addEventListener("input", () => {

                if (!slugInput.dataset.edited) {

                    slugInput.value =
                        this.generateSlug(nameInput.value);

                }

            });

            slugInput.addEventListener("input", () => {

                slugInput.dataset.edited = "true";

                slugInput.value =
                    this.generateSlug(slugInput.value);

            });

        }

        const imageInput =
            document.getElementById("categoryImage");

        if (imageInput) {

            imageInput.addEventListener(
                "input",
                () => this.updateImagePreview()
            );

        }

        const removeImageButton =
            document.getElementById("removeCategoryImage");

        if (removeImageButton) {

            removeImageButton.addEventListener(
                "click",
                () => this.removeImage()
            );

        }

    }

    /*==========================================================
      FORM ACTIONS
    ==========================================================*/

    handleSubmit(event) {

        event.preventDefault();

        const category = this.getFormData();

        const validation =
            this.validate(category);

        this.clearErrors();

        if (!validation.valid) {

            this.showErrors(validation.errors);

            return;

        }

        this.currentCategory = category;

        console.log(
            "Category ready for API:",
            category
        );

        alert(
            "Category validated successfully. API saving will be connected next."
        );

    }

    handleCancel() {

        if (
            !confirm(
                "Are you sure you want to cancel? Unsaved changes will be lost."
            )
        ) {

            return;

        }

        this.form.reset();

        this.removeImage();

    }

    handlePreview() {

        const category =
            this.getFormData();

        console.log(
            "Category preview:",
            category
        );

        alert(
            `Category Preview\n\nName: ${category.name}\nSlug: ${category.slug}\nStatus: ${category.status}`
        );

    }

    /*==========================================================
      FORM DATA
    ==========================================================*/

    getFormData() {

        return this.create({

            name:
                document.getElementById("categoryName")?.value,

            slug:
                document.getElementById("categorySlug")?.value,

            parentId:
                document.getElementById("parentCategory")?.value ||
                null,

            description:
                document.getElementById("categoryDescription")?.value,

            image:
                document.getElementById("categoryImage")?.value,

            status:
                document.getElementById("categoryStatus")?.value,

            seo: {

                title:
                    document.getElementById("seoTitle")?.value,

                description:
                    document.getElementById("seoDescription")?.value

            }

        });

    }

    /*==========================================================
      IMAGE
    ==========================================================*/

    updateImagePreview() {

        const input =
            document.getElementById("categoryImage");

        const preview =
            document.getElementById("categoryImagePreview");

        const image =
            document.getElementById("categoryImagePreviewImg");

        if (!input || !preview || !image) return;

        const url = input.value.trim();

        if (!url) {

            preview.hidden = true;

            image.src = "";

            return;

        }

        image.src = url;

        preview.hidden = false;

    }

    removeImage() {

        const input =
            document.getElementById("categoryImage");

        const preview =
            document.getElementById("categoryImagePreview");

        const image =
            document.getElementById("categoryImagePreviewImg");

        if (input) input.value = "";

        if (image) image.src = "";

        if (preview) preview.hidden = true;

    }

    /*==========================================================
      VALIDATION
    ==========================================================*/

    validate(category = {}) {

        const errors = {};

        if (!category.name) {

            errors.name =
                "Category name is required.";

        }

        if (!category.slug) {

            errors.slug =
                "Category slug is required.";

        }

        return {

            valid:
                Object.keys(errors).length === 0,

            errors

        };

    }

    clearErrors() {

        const fields = [
            "categoryName",
            "categorySlug"
        ];

        fields.forEach(id => {

            const field =
                document.getElementById(id);

            if (field) {

                field.classList.remove("is-invalid");

            }

        });

        const errors = [
            "categoryNameError",
            "categorySlugError"
        ];

        errors.forEach(id => {

            const element =
                document.getElementById(id);

            if (element) {

                element.textContent = "";

            }

        });

    }

    showErrors(errors = {}) {

        if (errors.name) {

            const field =
                document.getElementById("categoryName");

            const message =
                document.getElementById("categoryNameError");

            field?.classList.add("is-invalid");

            if (message) {

                message.textContent =
                    errors.name;

            }

        }

        if (errors.slug) {

            const field =
                document.getElementById("categorySlug");

            const message =
                document.getElementById("categorySlugError");

            field?.classList.add("is-invalid");

            if (message) {

                message.textContent =
                    errors.slug;

            }

        }

    }

    /*==========================================================
      UTILITIES
    ==========================================================*/

    create(data = {}) {

        const now =
            new Date().toISOString();

        return {

            id:
                data.id ||
                this.generateId(),

            name:
                String(data.name || "").trim(),

            slug:
                String(data.slug || "")
                    .trim()
                    .toLowerCase(),

            parentId:
                data.parentId || null,

            description:
                String(data.description || "").trim(),

            image:
                String(data.image || "").trim(),

            status:
                data.status === "inactive"
                    ? "inactive"
                    : "active",

            sortOrder:
                Number.isFinite(
                    Number(data.sortOrder)
                )
                    ? Number(data.sortOrder)
                    : 0,

            seo: {

                title:
                    String(
                        data.seo?.title || ""
                    ).trim(),

                description:
                    String(
                        data.seo?.description || ""
                    ).trim()

            },

            createdAt:
                data.createdAt || now,

            updatedAt:
                data.updatedAt || now

        };

    }

    generateId() {

        if (
            typeof crypto !== "undefined" &&
            crypto.randomUUID
        ) {

            return crypto.randomUUID();

        }

        return `cat-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 9)}`;

    }

    generateSlug(name = "") {

        return String(name)
            .trim()
            .toLowerCase()
            .replace(/['"]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    }

    normalize(category = {}) {

        return this.create(category);

    }

    setCurrent(category = null) {

        this.currentCategory =
            category
                ? this.normalize(category)
                : null;

        return this.currentCategory;

    }

    getCurrent() {

        return this.currentCategory;

    }

    setCategories(categories = []) {

        this.categories =
            Array.isArray(categories)
                ? categories.map(
                    category =>
                        this.normalize(category)
                )
                : [];

        return this.categories;

    }

    getAll() {

        return [...this.categories];

    }

    findById(id) {

        return this.categories.find(
            category =>
                String(category.id) === String(id)
        ) || null;

    }

    findBySlug(slug) {

        const normalizedSlug =
            String(slug)
                .trim()
                .toLowerCase();

        return this.categories.find(
            category =>
                category.slug === normalizedSlug
        ) || null;

    }

}

const categories =
    new Categories();

categories.init();

export default categories;