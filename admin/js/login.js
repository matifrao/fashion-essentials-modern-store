document.getElementById("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const error = document.getElementById("login-error");
  error.textContent = "";

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    window.location.href = "dashboard.html";
  } catch (loginError) {
    error.textContent = loginError.message;
  }
});
