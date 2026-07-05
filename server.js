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
    description: "Soft everyday tube caps designed for comfortable hijab styling.",
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
    description: "Flexible hijab caps for easy daily layering.",
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
    description: "Tie-back caps with a secure fit and soft finish.",
    related: ["Premium Hijab Tube Caps", "Fancy Shimmer Glitter Hijab Tie Caps"],
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
    description: "A dressier shimmer cap for special modest fashion looks.",
    related: ["Premium Hijab Tie Caps", "Premium Hijab Tube Caps"],
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
`);

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto
    .pbkdf2Sync(password, salt, 120000, 64, "sha512")
    .toString("hex");

  return { hash, salt };
}

function verifyPassword(password, user) {
  const { hash } = hashPassword(password, user.salt);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(user.password_hash));
}

function seedData() {
  const userCount = db.prepare("SELECT COUNT(*) AS count FROM users").get().count;

  if (!userCount) {
    const { hash, salt } = hashPassword("admin123");
    db.prepare(
      "INSERT INTO users (name, email, password_hash, salt, role) VALUES (?, ?, ?, ?, ?)"
    ).run("Admin", "admin@fashion.local", hash, salt, "admin");
  }

  const productCount = db.prepare("SELECT COUNT(*) AS count FROM products").get().count;

  if (!productCount) {
    defaultProducts.forEach(saveProduct);
  }
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
      id, name, category, price, stock, status, image, images, colors, sizes,
      description, related, updated_at
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
    JSON.stringify(product.images || [product.image].filter(Boolean)),
    JSON.stringify(product.colors || []),
    JSON.stringify(product.sizes || []),
    product.description || "",
    JSON.stringify(product.related || []),
    now
  );

  return getProduct(id);
}

function getProduct(id) {
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
  return row ? productFromRow(row) : null;
}

function getProducts() {
  return db
    .prepare("SELECT * FROM products ORDER BY created_at DESC")
    .all()
    .map(productFromRow);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 8_000_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function parseCookies(req) {
  return Object.fromEntries(
    String(req.headers.cookie || "")
      .split(";")
      .map((cookie) => cookie.trim().split("="))
      .filter(([key, value]) => key && value)
  );
}

function getCurrentUser(req) {
  const sid = parseCookies(req).sid;
  const session = sid && sessions.get(sid);

  if (!session) return null;

  return db
    .prepare("SELECT id, name, email, role FROM users WHERE id = ?")
    .get(session.userId);
}

function requireAuth(req, res) {
  const user = getCurrentUser(req);

  if (!user) {
    sendJson(res, 401, { error: "Authentication required" });
    return null;
  }

  return user;
}

async function handleApi(req, res) {
  if (req.url === "/api/login" && req.method === "POST") {
    const { email, password } = await readBody(req);
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

    if (!user || !verifyPassword(password || "", user)) {
      sendJson(res, 401, { error: "Invalid email or password" });
      return;
    }

    const sid = crypto.randomBytes(32).toString("hex");
    sessions.set(sid, { userId: user.id, createdAt: Date.now() });
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Set-Cookie": `sid=${sid}; HttpOnly; SameSite=Lax; Path=/`,
    });
    res.end(JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role }));
    return;
  }

  if (req.url === "/api/logout" && req.method === "POST") {
    const sid = parseCookies(req).sid;
    if (sid) sessions.delete(sid);
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Set-Cookie": "sid=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0",
    });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.url === "/api/me" && req.method === "GET") {
    const user = getCurrentUser(req);
    sendJson(res, user ? 200 : 401, user || { error: "Authentication required" });
    return;
  }

  if (req.url === "/api/products" && req.method === "GET") {
    sendJson(res, 200, getProducts());
    return;
  }

  if (req.url.startsWith("/api/products/") && req.method === "GET") {
    const id = decodeURIComponent(req.url.split("/").pop());
    const product = getProduct(id);
    sendJson(res, product ? 200 : 404, product || { error: "Product not found" });
    return;
  }

  if (req.url === "/api/products" && req.method === "POST") {
    if (!requireAuth(req, res)) return;
    const product = await readBody(req);
    sendJson(res, 200, saveProduct(product));
    return;
  }

  if (req.url.startsWith("/api/products/") && req.method === "DELETE") {
    if (!requireAuth(req, res)) return;
    const id = decodeURIComponent(req.url.split("/").pop());
    db.prepare("DELETE FROM products WHERE id = ?").run(id);
    sendJson(res, 200, { ok: true });
    return;
  }

  sendJson(res, 404, { error: "API route not found" });
}

function contentType(filePath) {
  return (
    {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".json": "application/json",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".mp4": "video/mp4",
    }[path.extname(filePath).toLowerCase()] || "application/octet-stream"
  );
}

function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);

  if (urlPath === "/") urlPath = "/index.html";
  if (urlPath === "/admin") urlPath = "/admin/dashboard.html";

  const isAdminPage =
    urlPath.startsWith("/admin/") &&
    urlPath.endsWith(".html") &&
    urlPath !== "/admin/login.html";

  if (isAdminPage && !getCurrentUser(req)) {
    res.writeHead(302, { Location: "/admin/login.html" });
    res.end();
    return;
  }

  const filePath = path.join(root, urlPath);

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, { "Content-Type": contentType(filePath) });
    res.end(data);
  });
}

seedData();

http
  .createServer((req, res) => {
    if (req.url.startsWith("/api/")) {
      handleApi(req, res).catch((error) => {
        sendJson(res, 500, { error: error.message });
      });
      return;
    }

    serveStatic(req, res);
  })
  .listen(port, () => {
    console.log(`Fashion Essentials running at http://localhost:${port}`);
    console.log("Admin login: admin@fashion.local / admin123");
  });
