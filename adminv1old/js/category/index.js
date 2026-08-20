import { renderGeneral } from "./general.js";
import { renderImage } from "./image.js";
import { renderSeo } from "./seo.js";
import { renderValidation } from "./validation.js";
import { initSave } from "./save.js";

document.addEventListener("DOMContentLoaded", () => {
  renderGeneral();
  renderImage();
  renderSeo();

  renderCategorySidebar();

  renderValidation();
  initSave();
});

function renderCategorySidebar() {
  renderPublishCard();
  renderStatusCard();
  renderParentCard();
}

function renderPublishCard() {
  const container = document.getElementById("publishCard");

  if (!container) {
    console.error("Category: #publishCard not found.");
    return;
  }

  container.innerHTML = `
    <div class="card__header">
      <div>
        <h2>Publish</h2>
        <p>Control category visibility.</p>
      </div>
    </div>

    <div class="card__body">
      <div class="form-group">
        <label for="categorySortOrder">
          Sort Order
        </label>

        <input
          type="number"
          id="categorySortOrder"
          name="sortOrder"
          class="form-control"
          value="0"
          min="0"
          step="1"
        />

        <small>
          Lower numbers appear first.
        </small>
      </div>
    </div>
  `;
}

function renderStatusCard() {
  const container = document.getElementById("statusCard");

  if (!container) {
    console.error("Category: #statusCard not found.");
    return;
  }

  container.innerHTML = `
    <div class="card__header">
      <div>
        <h2>Status</h2>
        <p>Choose whether this category is visible.</p>
      </div>
    </div>

    <div class="card__body">
      <div class="form-group">
        <label for="categoryStatus">
          Category Status
        </label>

        <select
          id="categoryStatus"
          name="status"
          class="form-control"
        >
          <option value="active" selected>
            Active
          </option>

          <option value="inactive">
            Inactive
          </option>
        </select>

        <small>
          Inactive categories can be hidden from the storefront.
        </small>
      </div>
    </div>
  `;
}

function renderParentCard() {
  const container = document.getElementById("parentCard");

  if (!container) {
    console.error("Category: #parentCard not found.");
    return;
  }

  container.innerHTML = `
    <div class="card__header">
      <div>
        <h2>Parent Category</h2>
        <p>Place this category under another category.</p>
      </div>
    </div>

    <div class="card__body">
      <div class="form-group">
        <label for="categoryParent">
          Parent Category
        </label>

        <select
          id="categoryParent"
          name="parentId"
          class="form-control"
        >
          <option value="">
            No Parent Category
          </option>
        </select>

        <small>
          Leave empty to make this a top-level category.
        </small>
      </div>
    </div>
  `;

  loadParentCategories();
}

async function loadParentCategories() {
  const select =
    document.getElementById("categoryParent");

  if (!select) {
    return;
  }

  try {
    const response = await fetch(
      "/api/categories",
      {
        method: "GET",
        credentials: "same-origin",
      }
    );

    if (!response.ok) {
      throw new Error(
        "Unable to load categories."
      );
    }

    const categories = await response.json();

    categories.forEach((category) => {
      const option =
        document.createElement("option");

      option.value = category.id;
      option.textContent = category.name;

      select.appendChild(option);
    });
  } catch (error) {
    console.error(
      "Category parent loading error:",
      error
    );
  }
}