/*==========================================================
  NexPage Commerce Platform

  File: validator.js
  Description: Universal Validation Engine

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

class Validator {

    /*======================================================
      Required
    ======================================================*/

    required(value) {

        if (value === null || value === undefined) {

            return false;

        }

        return String(value).trim() !== "";

    }

    /*======================================================
      Email
    ======================================================*/

    email(value) {

        if (!this.required(value)) {

            return false;

        }

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    }

    /*======================================================
      URL
    ======================================================*/

    url(value) {

        if (!this.required(value)) {

            return false;

        }

        try {

            new URL(value);

            return true;

        }

        catch {

            return false;

        }

    }

    /*======================================================
      Number
    ======================================================*/

    number(value) {

        return !isNaN(value);

    }

    /*======================================================
      Integer
    ======================================================*/

    integer(value) {

        return Number.isInteger(Number(value));

    }

    /*======================================================
      Positive
    ======================================================*/

    positive(value) {

        return Number(value) >= 0;

    }

    /*======================================================
      Min Length
    ======================================================*/

    minLength(value, length) {

        return String(value).length >= length;

    }

    /*======================================================
      Max Length
    ======================================================*/

    maxLength(value, length) {

        return String(value).length <= length;

    }

    /*======================================================
      Between Length
    ======================================================*/

    betweenLength(value, min, max) {

        const len = String(value).length;

        return len >= min && len <= max;

    }

    /*======================================================
      Min Value
    ======================================================*/

    min(value, min) {

        return Number(value) >= min;

    }

    /*======================================================
      Max Value
    ======================================================*/

    max(value, max) {

        return Number(value) <= max;

    }

    /*======================================================
      Range
    ======================================================*/

    range(value, min, max) {

        const number = Number(value);

        return number >= min && number <= max;

    }

    /*======================================================
      Slug
    ======================================================*/

    slug(value) {

        return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

    }

    /*======================================================
      SKU
    ======================================================*/

    sku(value) {

        return /^[A-Za-z0-9_-]+$/.test(value);

    }

    /*======================================================
      Barcode
    ======================================================*/

    barcode(value) {

        return /^[0-9]+$/.test(value);

    }

    /*======================================================
      File Type
    ======================================================*/

    fileType(file, allowedTypes = []) {

        return allowedTypes.includes(file.type);

    }

    /*======================================================
      File Size
    ======================================================*/

    fileSize(file, maxBytes) {

        return file.size <= maxBytes;

    }

    /*======================================================
      Match
    ======================================================*/

    match(value1, value2) {

        return value1 === value2;

    }

    /*======================================================
      Custom
    ======================================================*/

    custom(callback) {

        return callback();

    }

}

export default new Validator();