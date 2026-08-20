/*==========================================================
  NexPage Commerce Platform

  File: confirm.js
  Description: Confirmation Dialog

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

class ConfirmDialog {

    constructor() {

        this.overlay = null;

        this.resolve = null;

    }

    /*======================================================
      Show Dialog
    ======================================================*/

    show({

        title = "Confirmation",

        message = "Are you sure?",

        confirmText = "Confirm",

        cancelText = "Cancel"

    } = {}) {

        return new Promise(resolve => {

            this.resolve = resolve;

            this.render({

                title,

                message,

                confirmText,

                cancelText

            });

        });

    }

    /*======================================================
      Render
    ======================================================*/

    render(options) {

        this.destroy();

        this.overlay = document.createElement("div");

        this.overlay.className = "nx-confirm";

        this.overlay.innerHTML = `

            <div class="nx-confirm__dialog">

                <div class="nx-confirm__header">

                    <h2>

                        ${options.title}

                    </h2>

                </div>

                <div class="nx-confirm__body">

                    <p>

                        ${options.message}

                    </p>

                </div>

                <div class="nx-confirm__footer">

                    <button
                        class="btn btn-secondary nx-confirm-cancel"
                        type="button">

                        ${options.cancelText}

                    </button>

                    <button
                        class="btn btn-danger nx-confirm-ok"
                        type="button">

                        ${options.confirmText}

                    </button>

                </div>

            </div>

        `;

        document.body.appendChild(this.overlay);

        this.bindEvents();

    }

    /*======================================================
      Events
    ======================================================*/

    bindEvents() {

        this.overlay

            .querySelector(".nx-confirm-ok")

            .addEventListener("click", () => {

                this.close(true);

            });

        this.overlay

            .querySelector(".nx-confirm-cancel")

            .addEventListener("click", () => {

                this.close(false);

            });

        this.overlay.addEventListener("click", event => {

            if (event.target === this.overlay) {

                this.close(false);

            }

        });

        document.addEventListener(

            "keydown",

            this.handleEscape

        );

    }

    /*======================================================
      Escape Key
    ======================================================*/

    handleEscape = event => {

        if (event.key === "Escape") {

            this.close(false);

        }

    };

    /*======================================================
      Close
    ======================================================*/

    close(result) {

        document.removeEventListener(

            "keydown",

            this.handleEscape

        );

        this.destroy();

        if (this.resolve) {

            this.resolve(result);

        }

    }

    /*======================================================
      Destroy
    ======================================================*/

    destroy() {

        if (this.overlay) {

            this.overlay.remove();

            this.overlay = null;

        }

    }

}

export default new ConfirmDialog();