export function renderValidation() {
  const form = document.getElementById("categoryForm");

  if (!form) {
    console.error("Category: #categoryForm not found.");
    return;
  }

  const nameInput = document.getElementById("categoryName");
  const slugInput = document.getElementById("categorySlug");
  const descriptionInput = document.getElementById(
    "categoryDescription"
  );

  if (!nameInput || !slugInput || !descriptionInput) {
    console.error(
      "Category: required General fields not found."
    );
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    clearErrors(form);

    let valid = true;

    const name = nameInput.value.trim();
    const slug = slugInput.value.trim();

    if (!name) {
      showError(
        nameInput,
        "Category name is required."
      );
      valid = false;
    }

    if (!slug) {
      showError(
        slugInput,
        "Category slug is required."
      );
      valid = false;
    }

    if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      showError(
        slugInput,
        "Use lowercase letters, numbers and hyphens only."
      );
      valid = false;
    }

    if (!valid) {
      const firstError = form.querySelector(
        ".category-field-error"
      );

      if (firstError) {
        firstError.previousElementSibling?.focus();
      }

      return;
    }

    /*
     * Validation only.
     * Saving will be handled by save.js.
     */

    form.dispatchEvent(
      new CustomEvent("category:validated", {
        detail: {
          valid: true,
        },
      })
    );
  });
}

function showError(input, message) {
  input.classList.add("is-invalid");
  input.setAttribute("aria-invalid", "true");

  const error = document.createElement("small");

  error.className = "category-field-error";
  error.textContent = message;

  input.insertAdjacentElement(
    "afterend",
    error
  );
}

function clearErrors(form) {
  form
    .querySelectorAll(".category-field-error")
    .forEach((error) => error.remove());

  form
    .querySelectorAll(".is-invalid")
    .forEach((input) => {
      input.classList.remove("is-invalid");
      input.removeAttribute("aria-invalid");
    });
}