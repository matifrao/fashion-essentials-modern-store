const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const root = __dirname;
const dataDir = path.join(root, "data");
const dbPath = path.join(dataDir, "store.sqlite");
const port = Number(process.env.PORT) || 3000;
const sessions = new Map();

fs.mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(dbPath);

const defaultProducts = [
  {
    id: "premium-hijab-tube-caps",
    name: "Premium Hijab Tube Caps",
    category: "Caps",
    price: "PKR 299",
    stock: 24,
    status: "Active",
    image: "images/products/cat1/p1.jpeg",
    images: ["images/products/cat1/p1.jpeg"],
    colors: ["black", "cream", "beige", "navy"],
    sizes: ["Free Size"],
    description:
      "Soft everyday tube caps designed for comfortable hijab styling.",
    related: ["4-in-One Hijab Caps", "Premium Hijab Tie Caps"],
  },
  {
    id: "4-in-one-hijab-caps",
    name: "4-in-One Hijab Caps",
    category: "Caps",
    price: "PKR 350",
    stock: 18,
    status: "Active",
    image: "images/products/cat2/p2.jpg",
    images: ["images/products/cat2/p2.jpg"],
    colors: ["olive", "camel", "grey"],
    sizes: ["Free Size"],
    description:
      "Flexible hijab caps for easy daily layering.",
    related: ["Premium Hijab Tube Caps", "Premium Hijab Tie Caps"],
  },
  {
    id: "premium-hijab-tie-caps",
    name: "Premium Hijab Tie Caps",
    category: "Caps",
    price: "PKR 350",
    stock: 16,
    status: "Active",
    image: "images/products/cat3/p3.jpg",
    images: ["images/products/cat3/p3.jpg"],
    colors: ["pink", "blue"],
    sizes: ["Free Size"],
    description:
      "Tie-back caps with a secure fit and soft finish.",
    related: [
      "Premium Hijab Tube Caps",
      "Fancy Shimmer Glitter Hijab Tie Caps",
    ],
  },
  {
    id: "fancy-shimmer-glitter-hijab-tie-caps",
    name: "Fancy Shimmer Glitter Hijab Tie Caps",
    category: "Caps",
    price: "PKR 499",
    stock: 10,
    status: "Active",
    image: "images/products/cat4/p4.jpg",
    images: ["images/products/cat4/p4.jpg"],
    colors: ["black", "burgundy"],
    sizes: ["Free Size"],
    description:
      "A dressier shimmer cap for special modest fashion looks.",
    related: [
      "Premium Hijab Tie Caps",
      "Premium Hijab Tube Caps",
    ],
  },
];

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    price TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Active',
    image TEXT NOT NULL,
    images TEXT NOT NULL DEFAULT '[]',
    colors TEXT NOT NULL DEFAULT '[]',
    sizes TEXT NOT NULL DEFAULT '[]',
    description TEXT,
    related TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    parent_id TEXT,
    description TEXT,
    image TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    sort_order INTEGER NOT NULL DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (parent_id)
      REFERENCES categories(id)
      ON DELETE SET NULL
  );
`);

/* ==========================================================
   AUTHENTICATION
========================================================== */

function hashPassword(
  password,
  salt = crypto.randomBytes(16).toString("hex")
) {
  const hash = crypto
    .pbkdf2Sync(password, salt, 120000, 64, "sha512")
    .toString("hex");

  return { hash, salt };
}

function verifyPassword(password, user) {
  const { hash } = hashPassword(password, user.salt);

  return crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(user.password_hash)
  );
}

function seedData() {
  const userCount = db
    .prepare("SELECT COUNT(*) AS count FROM users")
    .get().count;

  if (!userCount) {
    const { hash, salt } = hashPassword("admin123");

    db.prepare(
      "INSERT INTO users (name, email, password_hash, salt, role) VALUES (?, ?, ?, ?, ?)"
    ).run(
      "Admin",
      "admin@fashion.local",
      hash,
      salt,
      "admin"
    );
  }

  const productCount = db
    .prepare("SELECT COUNT(*) AS count FROM products")
    .get().count;

  if (!productCount) {
    defaultProducts.forEach(saveProduct);
  }
}

/* ==========================================================
   GENERAL HELPERS
========================================================== */

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ==========================================================
   PRODUCT FUNCTIONS
========================================================== */

function productFromRow(row) {
  return {
    ...row,
    images: JSON.parse(row.images || "[]"),
    colors: JSON.parse(row.colors || "[]"),
    sizes: JSON.parse(row.sizes || "[]"),
    related: JSON.parse(row.related || "[]"),
  };
}

function saveProduct(product) {
  const id = product.id || slugify(product.name);
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO products (
      id,
      name,
      category,
      price,
      stock,
      status,
      image,
      images,
      colors,
      sizes,
      description,
      related,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      category = excluded.category,
      price = excluded.price,
      stock = excluded.stock,
      status = excluded.status,
      image = excluded.image,
      images = excluded.images,
      colors = excluded.colors,
      sizes = excluded.sizes,
      description = excluded.description,
      related = excluded.related,
      updated_at = excluded.updated_at
  `).run(
    id,
    product.name,
    product.category || "",
    product.price,
    Number(product.stock) || 0,
    product.status || "Active",
    product.image,
    JSON.stringify(
      product.images ||
        [product.image].filter(Boolean)
    ),
    JSON.stringify(product.colors || []),
    JSON.stringify(product.sizes || []),
    product.description || "",
    JSON.stringify(product.related || []),
    now
  );

  return getProduct(id);
}

function getProduct(id) {
  const row = db
    .prepare("SELECT * FROM products WHERE id = ?")
    .get(id);

  return row ? productFromRow(row) : null;
}

function getProducts() {
  return db
    .prepare(
      "SELECT * FROM products ORDER BY created_at DESC"
    )
    .all()
    .map(productFromRow);
}

function exportProductsJson() {
  const products = getProducts();

  fs.writeFileSync(
    path.join(dataDir, "products.json"),
    JSON.stringify(products, null, 2),
    "utf8"
  );
}

/* ==========================================================
   CATEGORY FUNCTIONS
========================================================== */

function categoryFromRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    parentId: row.parent_id || null,
    description: row.description || "",
    image: row.image || "",
    status: row.status || "active",
    sortOrder: Number(row.sort_order) || 0,

    seo: {
      title: row.seo_title || "",
      description: row.seo_description || "",
    },

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getCategory(id) {
  const row = db
    .prepare(
      "SELECT * FROM categories WHERE id = ?"
    )
    .get(id);

  return row ? categoryFromRow(row) : null;
}

function getCategories() {
  return db
    .prepare(`
      SELECT *
      FROM categories
      ORDER BY sort_order ASC, created_at DESC
    `)
    .all()
    .map(categoryFromRow);
}

function validateCategoryInput(data, currentId = null) {
  const name = String(data.name || "").trim();
  const slug = slugify(data.slug || name);

  if (!name) {
    return {
      valid: false,
      error: "Category name is required.",
    };
  }

  if (!slug) {
    return {
      valid: false,
      error: "Category slug is required.",
    };
  }

  const existing = db
    .prepare(
      "SELECT id FROM categories WHERE slug = ?"
    )
    .get(slug);

  if (
    existing &&
    String(existing.id) !==
      String(currentId || "")
  ) {
    return {
      valid: false,
      error:
        "A category with this slug already exists.",
      code: "DUPLICATE_SLUG",
    };
  }

  return {
    valid: true,
    name,
    slug,
  };
}

function validateCategoryParent(
  parentId,
  categoryId = null
) {
  if (!parentId) {
    return { valid: true };
  }

  if (
    String(parentId) ===
    String(categoryId || "")
  ) {
    return {
      valid: false,
      error:
        "A category cannot be its own parent.",
    };
  }

  const parent = getCategory(parentId);

  if (!parent) {
    return {
      valid: false,
      error: "Parent category not found.",
    };
  }

  const visited = new Set();
  let current = parent;

  while (current) {
    if (visited.has(current.id)) {
      break;
    }

    visited.add(current.id);

    if (
      String(current.id) ===
      String(categoryId || "")
    ) {
      return {
        valid: false,
        error:
          "This parent would create a category hierarchy cycle.",
      };
    }

    current = current.parentId
      ? getCategory(current.parentId)
      : null;
  }

  return { valid: true };
}

function saveCategory(
  category,
  existingId = null
) {
  const validation = validateCategoryInput(
    category,
    existingId || category.id || null
  );

  if (!validation.valid) {
    const error = new Error(
      validation.error
    );

    error.code =
      validation.code ||
      "INVALID_CATEGORY";

    throw error;
  }

  const id =
    existingId ||
    category.id ||
    crypto.randomUUID();

  const parentId =
    category.parentId || null;

  const parentValidation =
    validateCategoryParent(
      parentId,
      id
    );

  if (!parentValidation.valid) {
    const error = new Error(
      parentValidation.error
    );

    error.code = "INVALID_PARENT";

    throw error;
  }

  const now = new Date().toISOString();

  const description =
    String(
      category.description || ""
    ).trim();

  const image =
    String(
      category.image || ""
    ).trim();

  const status =
    category.status === "inactive"
      ? "inactive"
      : "active";

  const sortOrder =
    Number.isFinite(
      Number(category.sortOrder)
    )
      ? Number(category.sortOrder)
      : 0;

  const seoTitle =
    String(
      category.seo?.title || ""
    ).trim();

  const seoDescription =
    String(
      category.seo?.description || ""
    ).trim();

  const existingCategory =
    existingId
      ? getCategory(existingId)
      : null;

  const createdAt =
    existingCategory?.createdAt ||
    now;

  db.prepare(`
    INSERT INTO categories (
      id,
      name,
      slug,
      parent_id,
      description,
      image,
      status,
      sort_order,
      seo_title,
      seo_description,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      slug = excluded.slug,
      parent_id = excluded.parent_id,
      description = excluded.description,
      image = excluded.image,
      status = excluded.status,
      sort_order = excluded.sort_order,
      seo_title = excluded.seo_title,
      seo_description = excluded.seo_description,
      updated_at = excluded.updated_at
  `).run(
    id,
    validation.name,
    validation.slug,
    parentId,
    description,
    image,
    status,
    sortOrder,
    seoTitle,
    seoDescription,
    createdAt,
    now
  );

  return getCategory(id);
}

function deleteCategory(id) {
  const category = getCategory(id);

  if (!category) {
    return false;
  }

  const childCount = db
    .prepare(
      "SELECT COUNT(*) AS count FROM categories WHERE parent_id = ?"
    )
    .get(id).count;

  if (Number(childCount) > 0) {
    const error = new Error(
      "Cannot delete a category that has subcategories. Move or delete its subcategories first."
    );

    error.code =
      "CATEGORY_HAS_CHILDREN";

    throw error;
  }

  const result = db
    .prepare(
      "DELETE FROM categories WHERE id = ?"
    )
    .run(id);

  return result.changes > 0;
}

/* ==========================================================
   REQUEST HELPERS
========================================================== */

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;

      if (body.length > 8_000_000) {
        reject(
          new Error(
            "Request body too large"
          )
        );

        req.destroy();
      }
    });

    req.on("end", () => {
      try {
        resolve(
          body
            ? JSON.parse(body)
            : {}
        );
      } catch (error) {
        reject(error);
      }
    });
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type":
      "application/json",
  });

  res.end(
    JSON.stringify(data)
  );
}

function parseCookies(req) {
  return Object.fromEntries(
    String(
      req.headers.cookie || ""
    )
      .split(";")
      .map((cookie) =>
        cookie.trim().split("=")
      )
      .filter(
        ([key, value]) =>
          key && value
      )
  );
}

/* ==========================================================
   CURRENT USER / AUTH
========================================================== */

function getCurrentUser(req) {
  const sid =
    parseCookies(req).sid;

  const session =
    sid && sessions.get(sid);

  if (!session) {
    return null;
  }

  return db
    .prepare(
      "SELECT id, name, email, role FROM users WHERE id = ?"
    )
    .get(session.userId);
}

function requireAuth(req, res) {
  const user =
    getCurrentUser(req);

  if (!user) {
    sendJson(res, 401, {
      error:
        "Authentication required",
    });

    return null;
  }

  return user;
}

/* ==========================================================
   API ROUTES
========================================================== */

async function handleApi(req, res) {
  /* =========================
     LOGIN
  ========================= */

  if (
    req.url === "/api/login" &&
    req.method === "POST"
  ) {
    const {
      email,
      password,
    } = await readBody(req);

    const user = db
      .prepare(
        "SELECT * FROM users WHERE email = ?"
      )
      .get(email);

    if (
      !user ||
      !verifyPassword(
        password || "",
        user
      )
    ) {
      sendJson(res, 401, {
        error:
          "Invalid email or password",
      });

      return;
    }

    const sid =
      crypto.randomBytes(32)
        .toString("hex");

    sessions.set(sid, {
      userId: user.id,
      createdAt: Date.now(),
    });

    res.writeHead(200, {
      "Content-Type":
        "application/json",
      "Set-Cookie":
        `sid=${sid}; HttpOnly; SameSite=Lax; Path=/`,
    });

    res.end(
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
    );

    return;
  }

  /* =========================
     LOGOUT
  ========================= */

  if (
    req.url === "/api/logout" &&
    req.method === "POST"
  ) {
    const sid =
      parseCookies(req).sid;

    if (sid) {
      sessions.delete(sid);
    }

    res.writeHead(200, {
      "Content-Type":
        "application/json",
      "Set-Cookie":
        "sid=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0",
    });

    res.end(
      JSON.stringify({
        ok: true,
      })
    );

    return;
  }

  /* =========================
     CURRENT USER
  ========================= */

  if (
    req.url === "/api/me" &&
    req.method === "GET"
  ) {
    const user =
      getCurrentUser(req);

    sendJson(
      res,
      user ? 200 : 401,
      user || {
        error:
          "Authentication required",
      }
    );

    return;
  }

  /* ========================================================
     PRODUCTS
  ======================================================== */

  if (
    req.url === "/api/products" &&
    req.method === "GET"
  ) {
    sendJson(
      res,
      200,
      getProducts()
    );

    return;
  }

  if (
    req.url.startsWith(
      "/api/products/"
    ) &&
    req.method === "GET"
  ) {
    const id =
      decodeURIComponent(
        req.url
          .split("/")
          .pop()
      );

    const product =
      getProduct(id);

    sendJson(
      res,
      product ? 200 : 404,
      product || {
        error:
          "Product not found",
      }
    );

    return;
  }

  if (
    req.url === "/api/products" &&
    req.method === "POST"
  ) {
    if (!requireAuth(req, res)) {
      return;
    }

    const product =
      await readBody(req);

    const saved =
      saveProduct(product);

    exportProductsJson();

    sendJson(
      res,
      200,
      saved
    );

    return;
  }

  if (
    req.url.startsWith(
      "/api/products/"
    ) &&
    req.method === "DELETE"
  ) {
    if (!requireAuth(req, res)) {
      return;
    }

    const id =
      decodeURIComponent(
        req.url
          .split("/")
          .pop()
      );

    const existing =
      getProduct(id);

    if (!existing) {
      sendJson(res, 404, {
        error:
          "Product not found",
      });

      return;
    }

    db.prepare(
      "DELETE FROM products WHERE id = ?"
    ).run(id);

    exportProductsJson();

    sendJson(res, 200, {
      ok: true,
    });

    return;
  }

  /* ========================================================
     CATEGORIES
  ======================================================== */

  /* GET ALL */

  if (
    req.url === "/api/categories" &&
    req.method === "GET"
  ) {
    sendJson(
      res,
      200,
      getCategories()
    );

    return;
  }

  /* GET ONE */

  if (
    req.url.startsWith(
      "/api/categories/"
    ) &&
    req.method === "GET"
  ) {
    const id =
      decodeURIComponent(
        req.url
          .split("/")
          .pop()
      );

    const category =
      getCategory(id);

    sendJson(
      res,
      category ? 200 : 404,
      category || {
        error:
          "Category not found",
      }
    );

    return;
  }

  /* CREATE */

  if (
    req.url === "/api/categories" &&
    req.method === "POST"
  ) {
    if (!requireAuth(req, res)) {
      return;
    }

    const data =
      await readBody(req);

    try {
      const saved =
        saveCategory(data);

      sendJson(
        res,
        201,
        saved
      );
    } catch (error) {
      if (
        error.code ===
        "DUPLICATE_SLUG"
      ) {
        sendJson(res, 409, {
          error:
            error.message,
        });

        return;
      }

      if (
        error.code ===
          "INVALID_PARENT" ||
        error.code ===
          "INVALID_CATEGORY"
      ) {
        sendJson(res, 400, {
          error:
            error.message,
        });

        return;
      }

      throw error;
    }

    return;
  }

  /* UPDATE */

  if (
    req.url.startsWith(
      "/api/categories/"
    ) &&
    req.method === "PUT"
  ) {
    if (!requireAuth(req, res)) {
      return;
    }

    const id =
      decodeURIComponent(
        req.url
          .split("/")
          .pop()
      );

    if (!getCategory(id)) {
      sendJson(res, 404, {
        error:
          "Category not found",
      });

      return;
    }

    const data =
      await readBody(req);

    try {
      const saved =
        saveCategory(
          data,
          id
        );

      sendJson(
        res,
        200,
        saved
      );
    } catch (error) {
      if (
        error.code ===
        "DUPLICATE_SLUG"
      ) {
        sendJson(res, 409, {
          error:
            error.message,
        });

        return;
      }

      if (
        error.code ===
          "INVALID_PARENT" ||
        error.code ===
          "INVALID_CATEGORY"
      ) {
        sendJson(res, 400, {
          error:
            error.message,
        });

        return;
      }

      throw error;
    }

    return;
  }

  /* DELETE */

  if (
    req.url.startsWith(
      "/api/categories/"
    ) &&
    req.method === "DELETE"
  ) {
    if (!requireAuth(req, res)) {
      return;
    }

    const id =
      decodeURIComponent(
        req.url
          .split("/")
          .pop()
      );

    try {
      const deleted =
        deleteCategory(id);

      if (!deleted) {
        sendJson(res, 404, {
          error:
            "Category not found",
        });

        return;
      }

      sendJson(res, 200, {
        ok: true,
      });
    } catch (error) {
      if (
        error.code ===
        "CATEGORY_HAS_CHILDREN"
      ) {
        sendJson(res, 409, {
          error:
            error.message,
        });

        return;
      }

      throw error;
    }

    return;
  }

  /* =========================
     UNKNOWN API
  ========================= */

  sendJson(res, 404, {
    error:
      "API route not found",
  });
}

/* ==========================================================
   STATIC FILE SERVER
========================================================== */

function contentType(filePath) {
  return (
    {
      ".html":
        "text/html; charset=utf-8",
      ".css":
        "text/css; charset=utf-8",
      ".js":
        "text/javascript; charset=utf-8",
      ".json":
        "application/json",
      ".jpg":
        "image/jpeg",
      ".jpeg":
        "image/jpeg",
      ".png":
        "image/png",
      ".webp":
        "image/webp",
      ".svg":
        "image/svg+xml",
      ".mp4":
        "video/mp4",
    }[
      path
        .extname(filePath)
        .toLowerCase()
    ] ||
    "application/octet-stream"
  );
}

function serveStatic(req, res) {
  let urlPath =
    decodeURIComponent(
      req.url.split("?")[0]
    );

  if (urlPath === "/") {
    urlPath = "/index.html";
  }

  if (urlPath === "/admin") {
    urlPath =
      "/admin/dashboard.html";
  }

  const isAdminPage =
    urlPath.startsWith(
      "/admin/"
    ) &&
    urlPath.endsWith(
      ".html"
    ) &&
    urlPath !==
      "/admin/login.html";

  if (
    isAdminPage &&
    !getCurrentUser(req)
  ) {
    res.writeHead(302, {
      Location:
        "/admin/login.html",
    });

    res.end();
    return;
  }

  const filePath =
    path.join(
      root,
      urlPath
    );

  if (
    !filePath.startsWith(root)
  ) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(
    filePath,
    (error, data) => {
      if (error) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }

      res.writeHead(200, {
        "Content-Type":
          contentType(
            filePath
          ),
      });

      res.end(data);
    }
  );
}

/* ==========================================================
   START SERVER
========================================================== */

seedData();
exportProductsJson();

http
  .createServer(
    (req, res) => {
      if (
        req.url.startsWith(
          "/api/"
        )
      ) {
        handleApi(
          req,
          res
        ).catch((error) => {
          console.error(
            "API error:",
            error
          );

          sendJson(
            res,
            500,
            {
              error:
                error.message,
            }
          );
        });

        return;
      }

      serveStatic(
        req,
        res
      );
    }
  )
  .listen(
    port,
    () => {
      console.log(
        `Fashion Essentials running at http://localhost:${port}`
      );

      console.log(
        "Admin login: admin@fashion.local / admin123"
      );
    }
  );