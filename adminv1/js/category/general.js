export function renderGeneral() {
  const container = document.getElementById("generalCard");

  if (!container) {
    console.error("Category: #generalCard not found.");
    return;
  }

  container.innerHTML = `
    <div class="card__header">
      <div>
        <h2>General Information</h2>
        <p>Basic information about this category.</p>
      </div>
    </div>

    <div class="card__body">

      <!-- Category Name -->
      <div class="form-group">
        <label for="categoryName">
          Category Name <span class="required">*</span>
        </label>

        <input
          type="text"
          id="categoryName"
          name="name"
          class="form-control"
          placeholder="e.g. Hijabs"
          autocomplete="off"
        />

        <small>
          Enter the name customers will see.
        </small>
      </div>

      <!-- Slug -->
      <div class="form-group">
        <label for="categorySlug">
          Slug <span class="required">*</span>
        </label>

        <input
          type="text"
          id="categorySlug"
          name="slug"
          class="form-control"
          placeholder="e.g. hijabs"
          autocomplete="off"
        />

        <small>
          URL-friendly category identifier.
        </small>
      </div>

      <!-- Description -->
      <div class="form-group">
        <label for="categoryDescription">
          Description
        </label>

        <textarea
          id="categoryDescription"
          name="description"
          class="form-control"
          rows="6"
          placeholder="Describe this category..."
        ></textarea>

      </div>

    </div>
  `;

  const nameInput = document.getElementById("categoryName");
  const slugInput = document.getElementById("categorySlug");

  if (!nameInput || !slugInput) {
    console.error("Category: General fields could not be created.");
    return;
  }

  /*
   * Generate slug automatically from category name.
   * Once the administrator manually edits the slug,
   * automatic generation stops.
   */
  let slugManuallyEdited = false;

  slugInput.addEventListener("input", () => {
    slugManuallyEdited = true;

    slugInput.value = slugifyCategory(slugInput.value);
  });

  nameInput.addEventListener("input", () => {
    if (!slugManuallyEdited) {
      slugInput.value = slugifyCategory(nameInput.value);
    }
  });
}

function slugifyCategory(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}