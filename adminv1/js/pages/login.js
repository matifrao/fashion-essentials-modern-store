import { authApi } from "../core/api.js";

const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const remember = document.getElementById("remember");
const errorBox = document.getElementById("loginError");
const button = document.querySelector(".login__button");
const loader = document.getElementById("loginLoader");
const toggle = document.getElementById("togglePassword");
const showError = message => { errorBox.hidden = false; errorBox.textContent = message; };
const loading = state => { button.disabled = state; button.textContent = state ? "Signing In..." : "Sign In"; if (loader) loader.hidden = !state; };
document.addEventListener("DOMContentLoaded", () => { const saved = localStorage.getItem("adminEmail"); if (saved) { email.value = saved; remember.checked = true; } });
toggle?.addEventListener("click", () => { password.type = password.type === "password" ? "text" : "password"; });
form?.addEventListener("submit", async event => { event.preventDefault(); errorBox.hidden = true; if (!email.value.trim() || !password.value) return showError("Enter your email and password."); loading(true); try { await authApi.login({ email: email.value.trim(), password: password.value }); if (remember.checked) localStorage.setItem("adminEmail", email.value.trim()); else localStorage.removeItem("adminEmail"); window.location.href = "dashboard.html"; } catch (error) { showError(error.message); } finally { loading(false); } });
