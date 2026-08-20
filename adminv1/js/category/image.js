export function renderImage() {
  const container = document.getElementById("imageCard");

  if (!container) {
    console.error("Category: #imageCard not found.");
    return;
  }

  container.innerHTML = `
    <div class="card__header">
      <div>
        <h2>Category Image</h2>
        <p>Upload an image to represent this category.</p>
      </div>
    </div>

    <div class="card__body">

      <div class="category-image-upload">

        <div
          class="category-image-preview"
          id="categoryImagePreview"
        >
          <div class="category-image-preview__empty">
            <span>📷</span>
            <p>No image selected</p>
          </div>
        </div>

        <div class="category-image-actions">

          <label
            for="categoryImage"
            class="btn btn-outline"
          >
            Choose Image
          </label>

          <button
            type="button"
            class="btn btn-secondary"
            id="removeCategoryImage"
          >
            Remove
          </button>

          <input
            type="file"
            id="categoryImage"
            name="imageFile"
            accept="image/jpeg,image/png,image/webp,image/gif"
            hidden
          />

        </div>

        <small>
          Recommended: JPG, PNG or WebP. Use a clear category image.
        </small>

      </div>

      <!-- Stored image URL -->
      <input
        type="hidden"
        id="categoryImageUrl"
        name="image"
        value=""
      />

    </div>
  `;

  const fileInput =
    document.getElementById("categoryImage");

  const preview =
    document.getElementById("categoryImagePreview");

  const removeButton =
    document.getElementById("removeCategoryImage");

  const imageUrlInput =
    document.getElementById("categoryImageUrl");

  if (
    !fileInput ||
    !preview ||
    !removeButton ||
    !imageUrlInput
  ) {
    console.error(
      "Category: Image fields could not be initialized."
    );

    return;
  }

  let previewUrl = null;

  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      fileInput.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    previewUrl = URL.createObjectURL(file);

    preview.innerHTML = `
      <img
        src="${previewUrl}"
        alt="Category preview"
      />
    `;

    /*
     * The actual image URL will be assigned by the
     * uploader/backend later.
     */
    imageUrlInput.value = "";
  });

  removeButton.addEventListener("click", () => {
    fileInput.value = "";

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrl = null;
    }

    imageUrlInput.value = "";

    preview.innerHTML = `
      <div class="category-image-preview__empty">
        <span>📷</span>
        <p>No image selected</p>
      </div>
    `;
  });
}