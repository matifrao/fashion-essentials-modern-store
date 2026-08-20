/*==========================================================
  Fashion Essentials Admin V1
  File: helpers.js
  Description: Global Helper Functions
  Version: 1.0
==========================================================*/

import { CONFIG } from "./config.js";

/*==========================================================
  Currency
==========================================================*/

export function formatCurrency(value){

    const amount = Number(value) || 0;

    return `${CONFIG.DEFAULT_CURRENCY_SYMBOL}${amount.toLocaleString()}`;

}


/*==========================================================
  Date
==========================================================*/

export function formatDate(date){

    return new Date(date).toLocaleDateString();

}

export function formatDateTime(date){

    return new Date(date).toLocaleString();

}


/*==========================================================
  String
==========================================================*/

export function capitalize(text){

    if(!text) return "";

    return text.charAt(0).toUpperCase() + text.slice(1);

}

export function slugify(text){

    return String(text)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g,"-")
        .replace(/^-+|-+$/g,"");

}


/*==========================================================
  Number
==========================================================*/

export function randomNumber(min,max){

    return Math.floor(Math.random()*(max-min+1))+min;

}


/*==========================================================
  ID Generator
==========================================================*/

export function generateId(prefix="FE"){

    return `${prefix}-${Date.now()}-${randomNumber(1000,9999)}`;

}


/*==========================================================
  Debounce
==========================================================*/

export function debounce(callback,delay=300){

    let timer;

    return (...args)=>{

        clearTimeout(timer);

        timer=setTimeout(()=>{

            callback(...args);

        },delay);

    };

}


/*==========================================================
  Throttle
==========================================================*/

export function throttle(callback,delay=300){

    let waiting=false;

    return (...args)=>{

        if(waiting) return;

        callback(...args);

        waiting=true;

        setTimeout(()=>{

            waiting=false;

        },delay);

    };

}


/*==========================================================
  Clipboard
==========================================================*/

export async function copyToClipboard(text){

    try{

        await navigator.clipboard.writeText(text);

        return true;

    }

    catch{

        return false;

    }

}


/*==========================================================
  Validation
==========================================================*/

export function isValidEmail(email){

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}

export function isEmpty(value){

    return value===null ||
           value===undefined ||
           value==="";

}


/*==========================================================
  HTML
==========================================================*/

export function escapeHtml(text){

    const div=document.createElement("div");

    div.textContent=text;

    return div.innerHTML;

}


/*==========================================================
  Image
==========================================================*/

export function fileSize(size){

    if(size<1024){

        return `${size} B`;

    }

    if(size<1024*1024){

        return `${(size/1024).toFixed(1)} KB`;

    }

    return `${(size/(1024*1024)).toFixed(2)} MB`;

}


/*==========================================================
  Sleep
==========================================================*/

export function sleep(ms){

    return new Promise(resolve=>setTimeout(resolve,ms));

}


/*==========================================================
  Array
==========================================================*/

export function unique(array){

    return [...new Set(array)];

}

export function groupBy(array,key){

    return array.reduce((result,item)=>{

        (result[item[key]] = result[item[key]] || []).push(item);

        return result;

    },{});

}


/*==========================================================
  Object
==========================================================*/

export function deepClone(object){

    return structuredClone(object);

}