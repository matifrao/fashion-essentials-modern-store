/*==========================================================
  NexPage Commerce Platform

  File: modal.js
  Description: Reusable Modal Manager

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

class ModalManager {

    constructor() {

        this.modal = null;

        this.isOpen = false;

    }

    /*======================================================
      Open
    ======================================================*/

    open({

        title = "",

        content = "",

        size = "md",

        closable = true,

        footer = ""

    } = {}) {

        this.close();

        this.modal = document.createElement("div");

        this.modal.className = "nx-modal";

        this.modal.innerHTML = `

            <div class="nx-modal__dialog nx-modal--${size}">

                <div class="nx-modal__header">

                    <h2>${title}</h2>

                    ${closable
                        ? `<button
                                class="nx-modal__close"
                                type="button">
                                ×
                           </button>`
                        : ""
                    }

                </div>

                <div class="nx-modal__body">

                    ${content}

                </div>

                ${footer
                    ? `
                    <div class="nx-modal__footer">

                        ${footer}

                    </div>
                    `
                    : ""
                }

            </div>

        `;

        document.body.appendChild(this.modal);

        this.bindEvents(closable);

        this.isOpen = true;

    }

    /*======================================================
      Close
    ======================================================*/

    close() {

        if (!this.modal) return;

        this.modal.remove();

        this.modal = null;

        this.isOpen = false;

    }

    /*======================================================
      Set Content
    ======================================================*/

    setContent(html) {

        if (!this.modal) return;

        const body = this.modal.querySelector(".nx-modal__body");

        if (body) {

            body.innerHTML = html;

        }

    }

    /*======================================================
      Set Title
    ======================================================*/

    setTitle(title) {

        if (!this.modal) return;

        const heading = this.modal.querySelector("h2");

        if (heading) {

            heading.textContent = title;

        }

    }

    /*======================================================
      Events
    ======================================================*/

    bindEvents(closable) {

        if (!this.modal) return;

        if (closable) {

            this.modal

                .querySelector(".nx-modal__close")

                ?.addEventListener("click", () => {

                    this.close();

                });

        }

        this.modal.addEventListener("click", event => {

            if (event.target === this.modal && closable) {

                this.close();

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

            this.close();

        }

    };

}

export default new ModalManager();