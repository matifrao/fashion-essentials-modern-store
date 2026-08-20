/*==========================================================
  NexPage Commerce Platform

  File: base-module.js
  Description: Base Module

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

export default class BaseModule {

    constructor(name = "Module") {

        this.name = name;

        this.initialized = false;

    }

    /*======================================================
      Initialize
    ======================================================*/

    init() {

        this.initialized = true;

    }

    /*======================================================
      Destroy
    ======================================================*/

    destroy() {

    }

    /*======================================================
      Reset
    ======================================================*/

    reset() {

    }

    /*======================================================
      Validation
    ======================================================*/

    validate() {

        return {

            valid: true,

            errors: []

        };

    }

    /*======================================================
      Get Data
    ======================================================*/

    getData() {

        return {};

    }

    /*======================================================
      Set Data
    ======================================================*/

    setData(data = {}) {

        return data;

    }

    /*======================================================
      Loading
    ======================================================*/

    setLoading(button, loading, text = "Save") {

        if (!button) return;

        button.disabled = loading;

        button.dataset.originalText ??= button.textContent;

        button.textContent = loading

            ? "Loading..."

            : button.dataset.originalText || text;

    }

    /*======================================================
      Enable
    ======================================================*/

    enable(element) {

        if (element) {

            element.disabled = false;

        }

    }

    /*======================================================
      Disable
    ======================================================*/

    disable(element) {

        if (element) {

            element.disabled = true;

        }

    }

    /*======================================================
      Show
    ======================================================*/

    show(element) {

        if (element) {

            element.hidden = false;

        }

    }

    /*======================================================
      Hide
    ======================================================*/

    hide(element) {

        if (element) {

            element.hidden = true;

        }

    }

    /*======================================================
      Find
    ======================================================*/

    $(selector) {

        return document.querySelector(selector);

    }

    /*======================================================
      Find All
    ======================================================*/

    $$(selector) {

        return [...document.querySelectorAll(selector)];

    }

}