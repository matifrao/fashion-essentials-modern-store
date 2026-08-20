/*==========================================================
  NexPage Commerce Platform

  File: permissions.js
  Description: Role & Permission Manager

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

class PermissionManager {

    constructor() {

        this.user = null;

    }

    /*======================================================
      Set Current User
    ======================================================*/

    setUser(user = {}) {

        this.user = user;

    }

    /*======================================================
      Get Current User
    ======================================================*/

    getUser() {

        return this.user;

    }

    /*======================================================
      Is Logged In
    ======================================================*/

    isAuthenticated() {

        return this.user !== null;

    }

    /*======================================================
      Has Role
    ======================================================*/

    hasRole(role) {

        if (!this.user) {

            return false;

        }

        return this.user.role === role;

    }

    /*======================================================
      Has Any Role
    ======================================================*/

    hasAnyRole(roles = []) {

        if (!this.user) {

            return false;

        }

        return roles.includes(this.user.role);

    }

    /*======================================================
      Has Permission
    ======================================================*/

    can(permission) {

        if (!this.user) {

            return false;

        }

        const permissions = this.user.permissions || [];

        return permissions.includes(permission);

    }

    /*======================================================
      Has All Permissions
    ======================================================*/

    canAll(permissions = []) {

        return permissions.every(permission =>

            this.can(permission)

        );

    }

    /*======================================================
      Has Any Permission
    ======================================================*/

    canAny(permissions = []) {

        return permissions.some(permission =>

            this.can(permission)

        );

    }

    /*======================================================
      Page Access
    ======================================================*/

    canAccess(page) {

        return this.can(`page:${page}`);

    }

    /*======================================================
      Module Access
    ======================================================*/

    canUse(module) {

        return this.can(`module:${module}`);

    }

    /*======================================================
      Action Access
    ======================================================*/

    canCreate(module) {

        return this.can(`${module}:create`);

    }

    canEdit(module) {

        return this.can(`${module}:edit`);

    }

    canDelete(module) {

        return this.can(`${module}:delete`);

    }

    canView(module) {

        return this.can(`${module}:view`);

    }

}

export default new PermissionManager();