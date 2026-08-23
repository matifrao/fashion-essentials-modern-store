import { productsApi, supabase } from "../core/api.js";
import { startShell } from "./shell.js";

const $ = id => document.getElementById(id);
const slugify = text => text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
let productId = new URLSearchParams(location.search).get("id");
let images = [];
let colors = [];
let catalogue = [];
let linkedProductIds = [];

const page = `
<div class="page-head"><div><h2 id="heading">Add product</h2><p>Create a complete product listing for your shop.</p></div><div><a class="btn" href="products.html">Cancel</a> <button class="btn primary" id="saveTop">Save product</button></div></div>
<form id="productForm" class="editor"><div class="editor-main">
  <section class="card"><h3>Product information</h3><div class="field"><label>Product title</label><input id="name" required placeholder="e.g. Premium chiffon hijab"></div><div class="field"><label>Product description</label><textarea id="description" placeholder="Describe materials, fit, colours and care instructions."></textarea></div></section>
  <section class="card"><h3>Media</h3><div class="media-drop"><strong>Product images</strong><p class="hint">Upload JPG, PNG or WebP. Maximum 5 MB per image.</p><input id="images" type="file" accept="image/jpeg,image/png,image/webp" multiple></div><div id="gallery" class="gallery"></div></section>
  <section class="card"><h3>Pricing</h3><div class="row three"><div class="field"><label>Regular price <small>(PKR)</small></label><input id="price" type="number" min="0" step="0.01" required></div><div class="field"><label>Sale price <small>(optional)</small></label><input id="salePrice" type="number" min="0" step="0.01"></div><div class="field"><label>Cost per item <small>(optional)</small></label><input id="costPrice" type="number" min="0" step="0.01"></div></div></section>
  <section class="card"><h3>Inventory</h3><div class="row"><div class="field"><label>SKU</label><input id="sku" placeholder="FE-HIJ-001"></div><div class="field"><label>Barcode <small>(optional)</small></label><input id="barcode"></div></div><div class="row"><div class="field"><label>Available stock</label><input id="stock" type="number" min="0" value="0"></div><div class="field"><label>Low stock alert</label><input id="lowStockAlert" type="number" min="0" value="5"></div></div></section>
  <section class="card"><h3>Sizes and colours</h3><div class="field"><label>Available sizes <small>(comma separated)</small></label><input id="sizes" placeholder="Small, Medium, Large, XL"><p class="hint">These choices are stored with the product for the store product page.</p></div><div class="color-controls"><div class="field"><label>Colour name</label><input id="colorName" placeholder="Black"></div><div class="field"><label>Shade</label><input id="colorHex" type="color" value="#111111"></div><div class="field"><label>Colour image</label><select id="colorImage"><option value="">Upload a product image first</option></select></div><button type="button" class="btn" id="addColor">Add colour</button></div><div id="colorList" class="color-list"></div><div class="variant-preview"><div id="previewImage" class="placeholder">Choose a colour to preview its image</div><div><strong id="previewName">Colour preview</strong><p class="hint">Each colour is shown as a product thumbnail. Clicking it changes this preview image, just like the customer storefront.</p></div></div></section>
  <section class="card"><h3>Search engine listing</h3><div class="field"><label>URL handle</label><input id="slug" required placeholder="premium-chiffon-hijab"></div><div class="field"><label>SEO title <small>(optional)</small></label><input id="metaTitle" maxlength="70"></div><div class="field"><label>Meta description <small>(optional)</small></label><textarea id="metaDescription" maxlength="160"></textarea></div></section>
</div><aside class="editor-side"><section class="card"><h3>Publishing</h3><div class="field"><label>Status</label><select id="status"><option>Draft</option><option>Active</option><option>Archived</option></select></div><div class="field"><label>Product visibility</label><select id="visibility"><option value="public">Online store</option><option value="hidden">Hidden</option></select></div><button class="btn primary" style="width:100%" type="submit">Save product</button></section><section class="card"><h3>Organisation</h3><div class="field"><label>Category</label><input id="category" placeholder="Hijabs"></div><div class="field"><label>Brand</label><input id="brand" placeholder="Fashion Essentials"></div><div class="field"><label>Tags <small>(comma separated)</small></label><input id="tags" placeholder="chiffon, modest wear"></div></section><section class="card"><h3>Shipping</h3><div class="field"><label>Weight <small>(kg)</small></label><input id="weight" type="number" min="0" step="0.01"></div></section></aside></form>`;

function renderImages() {
  $("gallery").innerHTML = images.map((image, index) => `<div class="gallery-item"><img src="${image instanceof File ? URL.createObjectURL(image) : image}"><button type="button" data-image="${index}">×</button></div>`).join("");
  document.querySelectorAll("[data-image]").forEach(button => button.onclick = () => { images.splice(Number(button.dataset.image), 1); renderImages(); renderImageChoices(); });
}
function renderImageChoices() {
  const select = $("colorImage");
  const current = select.value;
  select.innerHTML = `<option value="">${images.length ? "Choose a product image" : "Upload a product image first"}</option>` + images.map((image, index) => `<option value="${index}">Product image ${index + 1}</option>`).join("");
  if (current && Number(current) < images.length) select.value = current;
}
function imageUrl(image) { return image instanceof File ? URL.createObjectURL(image) : image; }
function renderColors(activeIndex = 0) {
  $("colorList").innerHTML = colors.map((color, index) => `<button class="color-thumb ${index === activeIndex ? "active" : ""}" type="button" data-color="${index}" title="${color.name}"><img src="${color.image}"><span>${color.name}</span><i data-remove="${index}">×</i></button>`).join("");
  document.querySelectorAll("[data-color]").forEach(button => button.onclick = event => { if (event.target.dataset.remove !== undefined) return; previewColor(Number(button.dataset.color)); });
  document.querySelectorAll("[data-remove]").forEach(button => button.onclick = event => { event.stopPropagation(); colors.splice(Number(button.dataset.remove), 1); renderColors(); previewColor(0); });
  previewColor(activeIndex);
}
function previewColor(index) {
  const color = colors[index];
  const target = $("previewImage");
  if (!color) { target.className = "placeholder"; target.textContent = "Choose a colour to preview its image"; $("previewName").textContent = "Colour preview"; return; }
  target.outerHTML = `<img id="previewImage" src="${color.image}" alt="${color.name}">`;
  $("previewName").textContent = color.name;
  document.querySelectorAll("[data-color]").forEach(button => button.classList.toggle("active", Number(button.dataset.color) === index));
}
function field(key) { return $(key).value.trim(); }
function numberOrNull(key) { return field(key) === "" ? null : Number(field(key)); }

async function save(event) {
  event.preventDefault(); const button = event.submitter; button.disabled = true;
  try {
    const uploadedImages = await Promise.all(images.map(image => image instanceof File ? supabase.upload(image) : image));
    const product = { name: field("name"), description: field("description"), slug: field("slug"), price: Number(field("price")), salePrice: numberOrNull("salePrice"), costPrice: numberOrNull("costPrice"), sku: field("sku"), barcode: field("barcode"), stock: Number(field("stock") || 0), lowStockAlert: Number(field("lowStockAlert") || 0), sizes: field("sizes").split(",").map(size => size.trim()).filter(Boolean), colors: colors.map(color => ({ name: color.name, hex: color.hex, image: color.imageIndex !== undefined ? uploadedImages[color.imageIndex] : color.image })), status: field("status"), visibility: field("visibility"), category: field("category"), brand: field("brand"), tags: field("tags").split(",").map(tag => tag.trim()).filter(Boolean), weight: numberOrNull("weight"), metaTitle: field("metaTitle"), metaDescription: field("metaDescription"), images: uploadedImages };
    if (productId) await productsApi.update(productId, product); else await productsApi.create(product);
    location.href = "products.html";
  } catch (error) { alert(error.message); } finally { button.disabled = false; }
}
async function init() {
  if (!await startShell("products", page)) return;
  $("saveTop").onclick = () => $("productForm").requestSubmit();
  $("name").oninput = () => { if (!field("slug")) $("slug").value = slugify(field("name")); };
  $("images").onchange = event => { images.push(...event.target.files); renderImages(); renderImageChoices(); };
  $("addColor").onclick = () => { const index = $("colorImage").value; const name = field("colorName"); if (!name) return alert("Enter a colour name."); if (index === "") return alert("Upload product images first, then choose the image for this colour."); colors.push({ name, hex: $("colorHex").value, image: imageUrl(images[Number(index)]), imageIndex: Number(index) }); $("colorName").value = ""; $("colorHex").value = "#111111"; $("colorImage").value = ""; $("colorName").focus(); renderColors(colors.length - 1); };
  if (productId) { const product = await productsApi.get(productId); if (!product) throw new Error("Product not found."); $("heading").textContent = "Edit product"; ["name","description","price","salePrice","costPrice","sku","barcode","stock","lowStockAlert","slug","metaTitle","metaDescription","status","visibility","category","brand","weight"].forEach(key => { if (product[key] !== undefined) $(key).value = product[key] ?? ""; }); $("sizes").value = (product.sizes || []).join(", "); $("tags").value = (product.tags || []).join(", "); images = product.images || []; colors = product.colors || []; renderImages(); renderImageChoices(); renderColors(); }
  $("productForm").onsubmit = save;
}
init().catch(error => alert(error.message));