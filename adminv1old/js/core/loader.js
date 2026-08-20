/*==========================================================
  NexPage Commerce Platform

  File: loader.js
  Description: Universal Loading Manager

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

class Loader {

    constructor() {

        this.overlay = null;

        this.counter = 0;

    }

    /*======================================================
      Show Loader
    ======================================================*/

    show(message = "Loading...") {

        this.counter++;

        if (this.overlay) {

            this.setMessage(message);

            return;

        }

        this.overlay = document.createElement("div");

        this.overlay.id = "nx-loader";

        this.overlay.innerHTML = `

            <div class="nx-loader__box">

                <div class="nx-loader__spinner"></div>

                <div
                    class="nx-loader__message">

                    ${message}

                </div>

            </div>

        `;

        document.body.appendChild(this.overlay);

    }

    /*======================================================
      Hide Loader
    ======================================================*/

    hide() {

        if (this.counter > 0) {

            this.counter--;

        }

        if (this.counter > 0) {

            return;

        }

        if (!this.overlay) {

            return;

        }

        this.overlay.remove();

        this.overlay = null;

    }

    /*======================================================
      Update Message
    ======================================================*/

    setMessage(message) {

        if (!this.overlay) return;

        const label = this.overlay.querySelector(

            ".nx-loader__message"

        );

        if (label) {

            label.textContent = message;

        }

    }

    /*======================================================
      Wrap Async Task
    ======================================================*/

    async run(callback, message = "Loading...") {

        this.show(message);

        try {

            return await callback();

        }

        finally {

            this.hide();

        }

    }

    /*======================================================
      Is Visible
    ======================================================*/

    isVisible() {

        return this.overlay !== null;

    }

}

export default new Loader();