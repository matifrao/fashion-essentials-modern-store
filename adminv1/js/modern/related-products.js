import { productsApi } from "../core/api.js";

const productId = new URLSearchParams(location.search).get("id");
let catalogue = [];
let linked = [];
const safe = value => String(value || "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

function render() {
  const picker = document.getElementById("relatedPicker");
  picker.innerHTML = `<option value="">Select a product</option>` + catalogue.filter(product => product.id !== productId && !linked.includes(product.id)).map(product => `<option value="${product.id}">${safe(product.name)}${product.sku ? ` — ${safe(product.sku)}` : ""}</option>`).join("");
  document.getElementById("relatedItems").innerHTML = linked.map(id => catalogue.find(product => product.id === id)).filter(Boolean).map(product => `<button type="button" class="color-thumb" data-remove-related="${product.id}"><img src="${product.images?.[0] || "../images/placeholders/no-image.png"}" onerror="this.style.visibility='hidden'"><span>${safe(product.name)}</span><i>×</i></button>`).join("") || `<span class="hint">No products linked yet.</span>`;
  document.querySelectorAll("[data-remove-related]").forEach(button => button.onclick = () => { linked = linked.filter(id => id !== button.dataset.removeRelated); window.AdminV1RelatedProductIds = linked; render(); });
}

async function init() {
  let inventory = document.querySelector(".editor-main .card:nth-of-type(4)");
  for (let attempt = 0; !inventory && attempt < 30; attempt += 1) {
    await new Promise(resolve => requestAnimationFrame(resolve));
    inventory = document.querySelector(".editor-main .card:nth-of-type(4)");
  }
  if (!inventory) return;
  const section = document.createElement("section");
  section.className = "card";
  section.innerHTML = `<h3>Related products</h3><p class="hint">Choose products to show as “You may also like” or linked recommendations.</p><div class="color-controls"><div class="field" style="grid-column:span 3"><label>Product</label><select id="relatedPicker"><option value="">Select a product</option></select></div><button type="button" class="btn" id="addRelated">Link product</button></div><div class="color-list" id="relatedItems"></div>`;
  inventory.after(section);
  catalogue = await productsApi.list();
  if (productId) linked = (await productsApi.get(productId))?.relatedProductIds || [];
  window.AdminV1RelatedProductIds = linked;
  document.getElementById("addRelated").onclick = () => { const id = document.getElementById("relatedPicker").value; if (id) { linked.push(id); window.AdminV1RelatedProductIds = linked; render(); } };
  const create = productsApi.create.bind(productsApi), update = productsApi.update.bind(productsApi);
  productsApi.create = product => create({ ...product, relatedProductIds: window.AdminV1RelatedProductIds || [] });
  productsApi.update = (id, product) => update(id, { ...product, relatedProductIds: window.AdminV1RelatedProductIds || [] });
  render();
}
document.addEventListener("DOMContentLoaded", () => init().catch(error => console.error("Related products:", error)));
