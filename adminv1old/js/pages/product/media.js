/*==========================================================
  NexPage Commerce Platform

  File: media.js
  Description: Product Media Manager

  Module: Catalog / Products

  Version: 1.1.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

class ProductMedia {

    constructor() {

        this.images = [];

        this.featured = 0;

        this.maxImages = 20;

        this.allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        this.uploadArea = document.getElementById("mediaUpload");

        this.fileInput = document.getElementById("productImages");

        this.gallery = document.getElementById("mediaGallery");

        this.browseButton = document.getElementById("browseImages");

    }

    /*======================================================
      Initialize
    ======================================================*/

    init() {

        if (!this.uploadArea) return;

        this.bindEvents();

        this.renderGallery();

    }

    /*======================================================
      Events
    ======================================================*/

    bindEvents() {

        this.browseButton?.addEventListener("click", () => {

            this.fileInput.click();

        });

        this.fileInput?.addEventListener("change", (event) => {

            this.addFiles(event.target.files);

            this.fileInput.value = "";

        });

        this.uploadArea.addEventListener("dragover", (event) => {

            event.preventDefault();

            this.uploadArea.classList.add("is-dragover");

        });

        this.uploadArea.addEventListener("dragleave", () => {

            this.uploadArea.classList.remove("is-dragover");

        });

        this.uploadArea.addEventListener("drop", (event) => {

            event.preventDefault();

            this.uploadArea.classList.remove("is-dragover");

            this.addFiles(event.dataTransfer.files);

        });

    }

    /*======================================================
      Add Files
    ======================================================*/

    addFiles(files) {

        [...files].forEach(file => {

            if (!this.allowedTypes.includes(file.type)) {

                return;

            }

            if (this.images.length >= this.maxImages) {

                return;

            }

            this.images.push(file);

        });

        this.renderGallery();

    }

    /*======================================================
      Gallery
    ======================================================*/

    renderGallery() {

        if (!this.gallery) return;

        if (!this.images.length) {

            this.gallery.innerHTML = `

                <div class="media-gallery__empty">

                    No images uploaded yet.

                </div>

            `;

            return;

        }

        this.gallery.innerHTML = this.images.map((file, index) => `

            <div class="media-item">

                ${index === this.featured
                    ? `<span class="media-item__badge">Featured</span>`
                    : ""}

                <img
                    src="${URL.createObjectURL(file)}"
                    alt="${file.name}">

                <div class="media-item__footer">

                    <span class="media-item__name">

                        ${file.name}

                    </span>

                    <button
                        type="button"
                        class="btn btn-sm btn-danger media-delete"
                        data-index="${index}">

                        Delete

                    </button>

                </div>

            </div>

        `).join("");

        this.bindGalleryEvents();

    }

    /*======================================================
      Gallery Events
    ======================================================*/

    bindGalleryEvents() {

        this.gallery
            .querySelectorAll(".media-delete")
            .forEach(button => {

                button.addEventListener("click", () => {

                    this.deleteImage(Number(button.dataset.index));

                });

            });

    }

    /*======================================================
      Delete Image
    ======================================================*/

    deleteImage(index) {

        this.images.splice(index, 1);

        if (this.featured >= this.images.length) {

            this.featured = 0;

        }

        this.renderGallery();

    }

    /*======================================================
      Get Images
    ======================================================*/

    getImages() {

        return this.images;

    }

}

export default new ProductMedia();