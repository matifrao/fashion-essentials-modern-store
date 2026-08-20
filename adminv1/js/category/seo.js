export function renderSeo() {
  const container = document.getElementById("seoCard");

  if (!container) {
    console.error("Category: #seoCard not found.");
    return;
  }

  container.innerHTML = `
    <div class="card__header">
      <div>
        <h2>SEO</h2>
        <p>Optimize this category for search engines.</p>
      </div>
    </div>

    <div class="card__body">

      <div class="form-group">
        <label for="seoTitle">
          SEO Title
        </label>

        <input
          type="text"
          id="seoTitle"
          name="seoTitle"
          class="form-control"
          maxlength="60"
          placeholder="Enter SEO title"
        />

        <small>
          Recommended: up to 60 characters.
          <span id="seoTitleCount">0/60</span>
        </small>
      </div>

      <div class="form-group">
        <label for="seoDescription">
          SEO Description
        </label>

        <textarea
          id="seoDescription"
          name="seoDescription"
          class="form-control"
          rows="5"
          maxlength="160"
          placeholder="Enter SEO description"
        ></textarea>

        <small>
          Recommended: up to 160 characters.
          <span id="seoDescriptionCount">0/160</span>
        </small>
      </div>

    </div>
  `;

  const seoTitle =
    document.getElementById("seoTitle");

  const seoDescription =
    document.getElementById("seoDescription");

  const seoTitleCount =
    document.getElementById("seoTitleCount");

  const seoDescriptionCount =
    document.getElementById(
      "seoDescriptionCount"
    );

  if (
    !seoTitle ||
    !seoDescription ||
    !seoTitleCount ||
    !seoDescriptionCount
  ) {
    console.error(
      "Category: SEO fields could not be initialized."
    );
    return;
  }

  function updateCounts() {
    seoTitleCount.textContent =
      `${seoTitle.value.length}/60`;

    seoDescriptionCount.textContent =
      `${seoDescription.value.length}/160`;
  }

  seoTitle.addEventListener(
    "input",
    updateCounts
  );

  seoDescription.addEventListener(
    "input",
    updateCounts
  );

  updateCounts();
}