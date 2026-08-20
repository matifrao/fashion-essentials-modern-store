/*==========================================================
  Fashion Essentials Admin V1
  File: app.js
  Description: Application Bootstrap
  Version: 1.0
==========================================================*/

import { CONFIG } from "./config.js";
import { storage } from "./storage.js";

/*==========================================================
  Application
==========================================================*/

export const App = {

    init(){

        this.restoreTheme();

        this.restoreSidebar();

        this.checkAuthentication();

        this.registerEvents();

        console.log(

            `${CONFIG.APP_NAME} v${CONFIG.VERSION} Loaded`

        );

    },



    /*======================================================
      Authentication
    ======================================================*/

    checkAuthentication(){

        const page = window.location.pathname
            .split("/")
            .pop();

        if(page === CONFIG.LOGIN_PAGE){

            return;

        }

        const token = storage.getToken();

        if(!token){

            window.location.href = CONFIG.LOGIN_PAGE;

        }

    },



    /*======================================================
      Theme
    ======================================================*/

    restoreTheme(){

        const theme = storage.getTheme();

        document.documentElement.setAttribute(

            "data-theme",

            theme

        );

    },



    setTheme(theme){

        storage.setTheme(theme);

        document.documentElement.setAttribute(

            "data-theme",

            theme

        );

    },



    /*======================================================
      Sidebar
    ======================================================*/

    restoreSidebar(){

        const collapsed = storage.getSidebarCollapsed();

        document.body.classList.toggle(

            "sidebar-collapsed",

            collapsed

        );

    },



    toggleSidebar(){

        document.body.classList.toggle(

            "sidebar-collapsed"

        );

        storage.setSidebarCollapsed(

            document.body.classList.contains(

                "sidebar-collapsed"

            )

        );

    },



    /*======================================================
      Logout
    ======================================================*/

    logout(){

        storage.logout();

        window.location.href = CONFIG.LOGIN_PAGE;

    },



    /*======================================================
      Global Events
    ======================================================*/

    registerEvents(){

        document.addEventListener(

            "click",

            (event)=>{

                const target = event.target;

                if(

                    target.matches(

                        "[data-action='logout']"

                    )

                ){

                    this.logout();

                }

            }

        );

    }

};



/*==========================================================
  Auto Initialize
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        App.init();

    }

);