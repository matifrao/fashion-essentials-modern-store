import { supabase } from "../core/api.js";
import { startShell } from "./shell.js";

const money = value => `Rs. ${Number(value || 0).toLocaleString()}`;
const clean = value => String(value || "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const badge = status => `<span class="badge ${(status || "Pending").toLowerCase()}">${clean(status || "Pending")}</span>`;
const dateFmt = value => value ? new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "";

async function listOrders() {
  return supabase.select("orders", "select=*&order=created_at.desc");
}

async function updateStatus(id, status) {
  return supabase.update("orders", id, { status, updated_at: new Date().toISOString() });
}

function itemsSummary(items) {
  if (!Array.isArray(items) || !items.length) return "No items";
  const count = items.reduce((total, item) => total + Number(item.quantity || 0), 0);
  const first = items[0].name || "";
  return `${clean(first)}${items.length > 1 ? ` +${items.length - 1} more` : ""} · ${count} item${count === 1 ? "" : "s"}`;
}

function detailMarkup(order) {
  const items = Array.isArray(order.items) ? order.items : [];
  return `
    <div class="order-detail-inner">
      <div>
        <h4>Customer</h4>
        <div>${clean(order.customer_name)}</div>
        <div>${clean(order.customer_email)}</div>
        <div>${clean(order.customer_phone)}</div>
      </div>
      <div>
        <h4>Delivery</h4>
        <div>${clean(order.shipping_address)}</div>
        <div>${clean(order.city)} ${clean(order.postal_code)}</div>
        <div>${clean(order.payment_method)}</div>
      </div>
      <div style="grid-column:1/-1">
        <h4>Items</h4>
        <div class="order-items-list">
          ${items.map(item => `<div><span>${clean(item.name)} × ${Number(item.quantity || 0)}</span><span>${money(Number(item.price || 0) * Number(item.quantity || 0))}</span></div>`).join("") || "<div>No items recorded.</div>"}
        </div>
      </div>
      ${order.notes ? `<div style="grid-column:1/-1"><h4>Notes</h4><div>${clean(order.notes)}</div></div>` : ""}
    </div>
  `;
}

async function init() {
  const page = `
    <div class="page-head">
      <div><h2>Orders</h2><p>Track and manage customer orders.</p></div>
    </div>
    <div class="card">
      <div class="toolbar">
        <input class="search" id="search" placeholder="Search order #, customer, phone…">
        <span id="count"></span>
      </div>
      <div style="overflow:auto">
        <table>
          <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
          <tbody id="rows"></tbody>
        </table>
      </div>
    </div>
  `;

  if (!await startShell("orders", page)) return;

  let orders = [];
  const rows = document.getElementById("rows");
  const count = document.getElementById("count");
  const openRows = new Set();

  function render(query = "") {
    const term = query.toLowerCase();
    const visible = orders.filter(order =>
      [order.order_number, order.customer_name, order.customer_phone, order.customer_email]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );

    count.textContent = `${visible.length} order${visible.length === 1 ? "" : "s"}`;

    if (!visible.length) {
      rows.innerHTML = `<tr><td colspan="6" class="empty">No orders yet. Orders placed at checkout will show up here.</td></tr>`;
      return;
    }

    rows.innerHTML = visible.map(order => `
      <tr class="order-row" data-row="${order.id}">
        <td><strong>#${clean(order.order_number)}</strong></td>
        <td>${clean(order.customer_name)}<small style="display:block;color:#687385">${clean(order.customer_phone)}</small></td>
        <td>${itemsSummary(order.items)}</td>
        <td>${money(order.total)}</td>
        <td>
          <select class="status-select" data-status="${order.id}">
            ${statuses.map(status => `<option value="${status}" ${status === order.status ? "selected" : ""}>${status}</option>`).join("")}
          </select>
        </td>
        <td>${dateFmt(order.created_at)}</td>
      </tr>
      <tr class="order-detail" data-detail="${order.id}" style="display:${openRows.has(order.id) ? "table-row" : "none"}">
        <td colspan="6">${detailMarkup(order)}</td>
      </tr>
    `).join("");

    rows.querySelectorAll(".order-row").forEach(row => {
      row.onclick = event => {
        if (event.target.closest("select")) return;
        const id = row.dataset.row;
        const detail = rows.querySelector(`[data-detail="${id}"]`);
        if (openRows.has(id)) { openRows.delete(id); detail.style.display = "none"; }
        else { openRows.add(id); detail.style.display = "table-row"; }
      };
    });

    rows.querySelectorAll("[data-status]").forEach(select => {
      select.onclick = event => event.stopPropagation();
      select.onchange = async () => {
        const id = select.dataset.status;
        const previous = orders.find(order => order.id === id)?.status;
        try {
          await updateStatus(id, select.value);
          const order = orders.find(item => item.id === id);
          if (order) order.status = select.value;
        } catch (error) {
          alert(error.message);
          select.value = previous;
        }
      };
    });
  }

  orders = await listOrders();
  document.getElementById("search").oninput = event => render(event.target.value);
  render();
}

init().catch(error => alert(error.message));
