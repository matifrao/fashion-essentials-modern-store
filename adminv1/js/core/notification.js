/*==========================================================
  NexPage Commerce Platform

  File: notification.js
  Description: Toast Notification Manager

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

class NotificationManager {

    constructor() {

        this.container = null;

        this.duration = 4000;

    }

    /*======================================================
      Initialize
    ======================================================*/

    init() {

        if (document.getElementById("nx-toast-container")) {

            this.container = document.getElementById(

                "nx-toast-container"

            );

            return;

        }

        this.container = document.createElement("div");

        this.container.id = "nx-toast-container";

        document.body.appendChild(this.container);

    }

    /*======================================================
      Success
    ======================================================*/

    success(message) {

        this.show(message, "success");

    }

    /*======================================================
      Error
    ======================================================*/

    error(message) {

        this.show(message, "error");

    }

    /*======================================================
      Warning
    ======================================================*/

    warning(message) {

        this.show(message, "warning");

    }

    /*======================================================
      Info
    ======================================================*/

    info(message) {

        this.show(message, "info");

    }

    /*======================================================
      Show
    ======================================================*/

    show(message, type = "info") {

        if (!this.container) {

            this.init();

        }

        const toast = document.createElement("div");

        toast.className = `nx-toast nx-toast--${type}`;

        toast.innerHTML = `

            <div class="nx-toast__message">

                ${message}

            </div>

            <button
                class="nx-toast__close"
                type="button">

                ×

            </button>

        `;

        this.container.appendChild(toast);

        requestAnimationFrame(() => {

            toast.classList.add("show");

        });

        toast
            .querySelector(".nx-toast__close")
            .addEventListener("click", () => {

                this.remove(toast);

            });

        setTimeout(() => {

            this.remove(toast);

        }, this.duration);

    }

    /*======================================================
      Remove
    ======================================================*/

    remove(toast) {

        if (!toast) return;

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 250);

    }

}

export default new NotificationManager();