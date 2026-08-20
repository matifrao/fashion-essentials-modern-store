/*==========================================================
  Fashion Essentials Admin V1
  File: storage.js
  Description: Storage Manager
  Version: 1.0
==========================================================*/

import { CONFIG } from "./config.js";

/*==========================================================
  Local Storage
==========================================================*/

export const storage = {

    /*======================================================
      Generic
    ======================================================*/

    set(key,value){

        localStorage.setItem(key,JSON.stringify(value));

    },

    get(key,defaultValue=null){

        const value=localStorage.getItem(key);

        if(value===null){

            return defaultValue;

        }

        try{

            return JSON.parse(value);

        }

        catch{

            return value;

        }

    },

    remove(key){

        localStorage.removeItem(key);

    },

    clear(){

        localStorage.clear();

    },



    /*======================================================
      Authentication
    ======================================================*/

    setToken(token){

        this.set(CONFIG.TOKEN_KEY,token);

    },

    getToken(){

        return this.get(CONFIG.TOKEN_KEY);

    },

    removeToken(){

        this.remove(CONFIG.TOKEN_KEY);

    },



    setUser(user){

        this.set(CONFIG.USER_KEY,user);

    },

    getUser(){

        return this.get(CONFIG.USER_KEY);

    },

    removeUser(){

        this.remove(CONFIG.USER_KEY);

    },



    logout(){

        this.removeToken();

        this.removeUser();

    },



    /*======================================================
      Theme
    ======================================================*/

    setTheme(theme){

        this.set("fe_theme",theme);

    },

    getTheme(){

        return this.get("fe_theme",CONFIG.DEFAULT_THEME);

    },



    /*======================================================
      Sidebar
    ======================================================*/

    setSidebarCollapsed(state){

        this.set("fe_sidebar",state);

    },

    getSidebarCollapsed(){

        return this.get("fe_sidebar",false);

    },



    /*======================================================
      Dashboard
    ======================================================*/

    setDashboardFilters(filters){

        this.set("fe_dashboard_filters",filters);

    },

    getDashboardFilters(){

        return this.get("fe_dashboard_filters",{});

    },



    /*======================================================
      Products
    ======================================================*/

    saveDraft(product){

        this.set("fe_product_draft",product);

    },

    getDraft(){

        return this.get("fe_product_draft");

    },

    removeDraft(){

        this.remove("fe_product_draft");

    }

};



/*==========================================================
  Session Storage
==========================================================*/

export const session = {

    set(key,value){

        sessionStorage.setItem(key,JSON.stringify(value));

    },

    get(key,defaultValue=null){

        const value=sessionStorage.getItem(key);

        if(value===null){

            return defaultValue;

        }

        try{

            return JSON.parse(value);

        }

        catch{

            return value;

        }

    },

    remove(key){

        sessionStorage.removeItem(key);

    },

    clear(){

        sessionStorage.clear();

    }

};