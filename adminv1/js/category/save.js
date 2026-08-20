export function initSave() {
  const form = document.getElementById("categoryForm");

  if (!form) {
    console.error("Category: #categoryForm not found.");
    return;
  }

  form.addEventListener("category:validated", async () => {
    await saveCategory();
  });

  const cancelButton =
    document.getElementById("cancelBtn");

  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      window.location.href = "categories.html";
    });
  }

  const previewButton =
    document.getElementById("previewBtn");

  if (previewButton) {
    previewButton.addEventListener("click", () => {
      previewCategory();
    });
  }
}

async function saveCategory() {
  const form =
    document.getElementById("categoryForm");

  const saveButton =
    form.querySelector(
      'button[type="submit"]'
    );

  const category = {
    name:
      document.getElementById(
        "categoryName"
      )?.value.trim() || "",

    slug:
      document.getElementById(
        "categorySlug"
      )?.value.trim() || "",

    description:
      document.getElementById(
        "categoryDescription"
      )?.value.trim() || "",

    image:
      document.getElementById(
        "categoryImageUrl"
      )?.value.trim() || "",

    status:
      document.getElementById(
        "categoryStatus"
      )?.value || "active",

    parentId:
      document.getElementById(
        "categoryParent"
      )?.value || null,

    sortOrder:
      Number(
        document.getElementById(
          "categorySortOrder"
        )?.value || 0
      ),

    seo: {
      title:
        document.getElementById(
          "seoTitle"
        )?.value.trim() || "",

      description:
        document.getElementById(
          "seoDescription"
        )?.value.trim() || "",
    },
  };

  try {
    setSavingState(saveButton, true);

    const response = await fetch(
      "/api/categories",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(category),
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.error ||
          "Unable to save category."
      );
    }

    showMessage(
      "Category saved successfully.",
      "success"
    );

    /*
     * Give the user a moment to see the
     * success message, then return to
     * the categories listing.
     */
    setTimeout(() => {
      window.location.href =
        "categories.html";
    }, 800);
  } catch (error) {
    console.error(
      "Category save error:",
      error
    );

    showMessage(
      error.message ||
        "Unable to save category.",
      "error"
    );
  } finally {
    setSavingState(
      saveButton,
      false
    );
  }
}

function setSavingState(
  button,
  saving
) {
  if (!button) return;

  if (saving) {
    button.dataset.originalText =
      button.textContent;

    button.disabled = true;
    button.textContent =
      "Saving...";
  } else {
    button.disabled = false;

    button.textContent =
      button.dataset.originalText ||
      "Save Category";
  }
}

function showMessage(
  message,
  type
) {
  let messageBox =
    document.getElementById(
      "categorySaveMessage"
    );

  if (!messageBox) {
    messageBox =
      document.createElement("div");

    messageBox.id =
      "categorySaveMessage";

    messageBox.setAttribute(
      "role",
      "alert"
    );

    const form =
      document.getElementById(
        "categoryForm"
      );

    form.prepend(messageBox);
  }

  messageBox.className =
    `category-save-message category-save-message--${type}`;

  messageBox.textContent =
    message;
}

function previewCategory() {
  const name =
    document.getElementById(
      "categoryName"
    )?.value.trim();

  const description =
    document.getElementById(
      "categoryDescription"
    )?.value.trim();

  if (!name) {
    alert(
      "Enter a category name before previewing."
    );
    return;
  }

  const image =
    document.getElementById(
      "categoryImageUrl"
    )?.value.trim();

  const previewWindow =
    window.open(
      "",
      "_blank",
      "width=800,height=600"
    );

  if (!previewWindow) {
    alert(
      "Please allow pop-ups to preview the category."
    );
    return;
  }

  previewWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${escapeHtml(name)} - Preview</title>

        <style>
          body {
            margin: 0;
            padding: 40px 20px;
            font-family: Arial, sans-serif;
            background: #f5f7fb;
            color: #1f2937;
          }

          .preview {
            max-width: 700px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,.08);
          }

          img {
            display: block;
            width: 100%;
            max-height: 350px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 24px;
          }

          h1 {
            margin-bottom: 12px;
          }

          p {
            line-height: 1.6;
            color: #64748b;
          }
        </style>
      </head>

      <body>
        <article class="preview">
          ${
            image
              ? `<img src="${escapeHtml(
                  image
                )}" alt="${escapeHtml(
                  name
                )}">`
              : ""
          }

          <h1>${escapeHtml(
            name
          )}</h1>

          <p>${escapeHtml(
            description ||
              "No category description."
          )}</p>
        </article>
      </body>
    </html>
  `);

  previewWindow.document.close();
}

function escapeHtml(value) {
  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}