/*==========================================================
  NexPage Commerce Platform

  File: license.js
  Description: License & Feature Manager

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

class LicenseManager {

    constructor() {

        this.license = null;

    }

    /*======================================================
      Set License
    ======================================================*/

    set(license = {}) {

        this.license = license;

    }

    /*======================================================
      Get License
    ======================================================*/

    get() {

        return this.license;

    }

    /*======================================================
      Is Active
    ======================================================*/

    isActive() {

        return !!this.license?.active;

    }

    /*======================================================
      Edition
    ======================================================*/

    edition() {

        return this.license?.edition || "Community";

    }

    /*======================================================
      Has Feature
    ======================================================*/

    has(feature) {

        if (!this.license) {

            return false;

        }

        return (this.license.features || [])

            .includes(feature);

    }

    /*======================================================
      Has Any Feature
    ======================================================*/

    hasAny(features = []) {

        return features.some(feature =>

            this.has(feature)

        );

    }

    /*======================================================
      Has All Features
    ======================================================*/

    hasAll(features = []) {

        return features.every(feature =>

            this.has(feature)

        );

    }

    /*======================================================
      Expiry
    ======================================================*/

    isExpired() {

        if (!this.license?.expires) {

            return false;

        }

        return new Date()

            > new Date(this.license.expires);

    }

    /*======================================================
      Days Remaining
    ======================================================*/

    daysRemaining() {

        if (!this.license?.expires) {

            return Infinity;

        }

        const diff =

            new Date(this.license.expires)

            - new Date();

        return Math.ceil(

            diff / 86400000

        );

    }

}

export default new LicenseManager();