/*==========================================================
  Fashion Essentials Admin V1
  File: login.js
  Description: Login Page
  Version: 1.0
==========================================================*/

"use strict";

/*==========================================================
  Elements
==========================================================*/

const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const rememberInput = document.getElementById("remember");

const togglePassword = document.getElementById("togglePassword");

const loginButton = document.querySelector(".login__button");

const loader = document.getElementById("loginLoader");

const errorBox = document.getElementById("loginError");


/*==========================================================
  Initial Load
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    loadRememberedEmail();

});


/*==========================================================
  Password Visibility
==========================================================*/

togglePassword.addEventListener("click", () => {

    if(passwordInput.type === "password"){

        passwordInput.type = "text";

        togglePassword.textContent = "🙈";

    }else{

        passwordInput.type = "password";

        togglePassword.textContent = "👁";

    }

});


/*==========================================================
  Form Submit
==========================================================*/

loginForm.addEventListener("submit", async (event)=>{

    event.preventDefault();

    hideError();

    const email = emailInput.value.trim();

    const password = passwordInput.value.trim();

    if(!validateEmail(email)){

        return showError("Please enter a valid email address.");

    }

    if(password.length < 6){

        return showError("Password must contain at least 6 characters.");

    }

    rememberEmail();

    setLoading(true);

    try{

        const response = await fetch("/api/login",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                email,
                password

            })

        });

        const data = await response.json();

        if(!response.ok){

            throw new Error(data.message || "Login failed.");

        }

        sessionStorage.setItem("adminUser",JSON.stringify(data.user));

        window.location.href = "dashboard.html";

    }

    catch(error){

        showError(error.message);

    }

    finally{

        setLoading(false);

    }

});


/*==========================================================
  Validation
==========================================================*/

function validateEmail(email){

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}


/*==========================================================
  Remember Email
==========================================================*/

function rememberEmail(){

    if(rememberInput.checked){

        localStorage.setItem(

            "adminEmail",

            emailInput.value.trim()

        );

    }

    else{

        localStorage.removeItem("adminEmail");

    }

}


function loadRememberedEmail(){

    const savedEmail = localStorage.getItem("adminEmail");

    if(savedEmail){

        emailInput.value = savedEmail;

        rememberInput.checked = true;

    }

}


/*==========================================================
  Loading State
==========================================================*/

function setLoading(status){

    if(status){

        loginButton.disabled = true;

        loader.hidden = false;

        loginButton.textContent = "Signing In...";

    }

    else{

        loginButton.disabled = false;

        loader.hidden = true;

        loginButton.textContent = "Sign In";

    }

}


/*==========================================================
  Error Handling
==========================================================*/

function showError(message){

    errorBox.hidden = false;

    errorBox.textContent = message;

}


function hideError(){

    errorBox.hidden = true;

    errorBox.textContent = "";

}