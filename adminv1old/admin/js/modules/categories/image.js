/*==========================================================
  NexPage Commerce Platform

  File: image.js
  Description: Category Image Manager

  Module: Categories

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

class CategoryImage {

    constructor() {

        this.card = document.getElementById("imageCard");

        this.file = null;

        this.previewUrl = null;

        this.allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        this.maxFileSize = 5 * 1024 * 1024;

    }


    /*======================================================
      Initialize
    ======================================================*/

    init() {

        if (!this.card) return;

        this.render();

        this.cacheElements();

        this.bindEvents();

    }


    /*======================================================
      Render
    ======================================================*/

    render() {

        this.card.innerHTML = `

            <div class="card__header">

                <h2>

                    Category Image

                </h2>

            </div>


            <div class="card__body">

                <div class="category-image">


                    <!-- Upload Area -->

                    <div
                        class="category-image__upload"
                        id="categoryImageUpload">


                        <div
                            class="category-image__placeholder"
                            id="categoryImagePlaceholder">

                            <div class="category-image__icon">

                                📁

                            </div>

                            <strong>

                                Upload Category Image

                            </strong>

                            <span>

                                JPG, PNG or WebP up to 5MB

                            </span>

                        </div>


                        <img
                            id="categoryImagePreview"
                            class="category-image__preview"
                            alt="Category preview"
                            hidden>


                    </div>


                    <!-- File Input -->

                    <input
                        type="file"
                        id="categoryImageInput"
                        accept="image/jpeg,image/png,image/webp"
                        hidden>


                    <!-- Actions -->

                    <div class="category-image__actions">

                        <button
                            type="button"
                            class="btn btn-outline"
                            id="categoryImageBrowse">

                            Choose Image

                        </button>


                        <button
                            type="button"
                            class="btn btn-secondary"
                            id="categoryImageRemove"
                            hidden>

                            Remove

                        </button>

                    </div>


                    <!-- Status -->

                    <p
                        class="category-image__status"
                        id="categoryImageStatus"
                        aria-live="polite">

                    </p>

                </div>

            </div>

        `;

    }


    /*======================================================
      Cache Elements
    ======================================================*/

    cacheElements() {

        this.uploadArea = document.getElementById(
            "categoryImageUpload"
        );

        this.fileInput = document.getElementById(
            "categoryImageInput"
        );

        this.preview = document.getElementById(
            "categoryImagePreview"
        );

        this.placeholder = document.getElementById(
            "categoryImagePlaceholder"
        );

        this.browseButton = document.getElementById(
            "categoryImageBrowse"
        );

        this.removeButton = document.getElementById(
            "categoryImageRemove"
        );

        this.status = document.getElementById(
            "categoryImageStatus"
        );

    }


    /*======================================================
      Events
    ======================================================*/

    bindEvents() {

        this.browseButton?.addEventListener(
            "click",
            () => this.openFilePicker()
        );


        this.fileInput?.addEventListener(
            "change",
            event => {

                const file = event.target.files?.[0];

                if (!file) return;

                this.handleFile(file);

            }
        );


        this.removeButton?.addEventListener(
            "click",
            () => this.remove()
        );


        /*----------------------------------------------
          Drag & Drop
        ----------------------------------------------*/

        this.uploadArea?.addEventListener(
            "dragover",
            event => {

                event.preventDefault();

                this.uploadArea.classList.add(
                    "is-dragging"
                );

            }
        );


        this.uploadArea?.addEventListener(
            "dragleave",
            () => {

                this.uploadArea.classList.remove(
                    "is-dragging"
                );

            }
        );


        this.uploadArea?.addEventListener(
            "drop",
            event => {

                event.preventDefault();

                this.uploadArea.classList.remove(
                    "is-dragging"
                );

                const file = event.dataTransfer
                    ?.files?.[0];

                if (!file) return;

                this.handleFile(file);

            }
        );

    }


    /*======================================================
      Open File Picker
    ======================================================*/

    openFilePicker() {

        this.fileInput?.click();

    }


    /*======================================================
      Handle File
    ======================================================*/

    handleFile(file) {

        const validation = this.validateFile(file);

        if (!validation.valid) {

            this.showStatus(
                validation.message,
                true
            );

            this.resetInput();

            return;

        }

        this.file = file;

        this.createPreview(file);

    }


    /*======================================================
      Validate File
    ======================================================*/

    validateFile(file) {

        if (!this.allowedTypes.includes(file.type)) {

            return {

                valid: false,

                message:
                    "Please select a JPG, PNG or WebP image."

            };

        }


        if (file.size > this.maxFileSize) {

            return {

                valid: false,

                message:
                    "Image size must be 5MB or smaller."

            };

        }


        return {

            valid: true

        };

    }


    /*======================================================
      Create Preview
    ======================================================*/

    createPreview(file) {

        if (this.previewUrl) {

            URL.revokeObjectURL(
                this.previewUrl
            );

        }

        this.previewUrl = URL.createObjectURL(file);

        this.preview.src = this.previewUrl;

        this.preview.hidden = false;

        this.placeholder.hidden = true;

        this.removeButton.hidden = false;

        this.showStatus(
            `${file.name} selected.`,
            false
        );

    }


    /*======================================================
      Remove Image
    ======================================================*/

    remove() {

        this.file = null;

        this.resetInput();

        if (this.previewUrl) {

            URL.revokeObjectURL(
                this.previewUrl
            );

            this.previewUrl = null;

        }

        this.preview.src = "";

        this.preview.hidden = true;

        this.placeholder.hidden = false;

        this.removeButton.hidden = true;

        this.showStatus("", false);

    }


    /*======================================================
      Reset File Input
    ======================================================*/

    resetInput() {

        if (this.fileInput) {

            this.fileInput.value = "";

        }

    }


    /*======================================================
      Get Selected File
    ======================================================*/

    getFile() {

        return this.file;

    }


    /*======================================================
      Has Image
    ======================================================*/

    hasImage() {

        return this.file !== null;

    }


    /*======================================================
      Status
    ======================================================*/

    showStatus(message, error = false) {

        if (!this.status) return;

        this.status.textContent = message;

        this.status.classList.toggle(
            "is-error",
            error
        );

    }

}


export default new CategoryImage();