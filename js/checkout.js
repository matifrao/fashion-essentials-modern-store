const SUPABASE_URL = "https://omnlwbmahntspldbzarj.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ET-KSHRDbelW54DQ_ql-ag_7zAUX5gk";

const checkoutItems = document.getElementById("checkout-items");
const checkoutSubtotal = document.getElementById("checkout-subtotal");
const checkoutTotal = document.getElementById("checkout-total");
const checkoutForm = document.getElementById("checkout-form");

function renderCheckout() {
  const cart = FashionCart.getCart();

  if (!cart.length) {
    window.location.href = "cart.html";
    return;
  }

  checkoutItems.innerHTML = cart
    .map(
      (item) => `
        <div class="checkout-item">
          <div>
            <strong>${item.name}</strong>
            ${
              item.color || item.size
                ? `<span class="checkout-item-variant">${[item.color, item.size]
                    .filter(Boolean)
                    .join(" · ")}</span>`
                : ""
            }
            <span>Qty ${item.quantity}</span>
          </div>
          <span>${FashionCart.formatPrice(
            FashionCart.parsePrice(item.price) * item.quantity
          )}</span>
        </div>
      `
    )
    .join("");

  const subtotal = FashionCart.getSubtotal();

  checkoutSubtotal.textContent = FashionCart.formatPrice(subtotal);
  checkoutTotal.textContent = FashionCart.formatPrice(subtotal);
}

function showError(message) {
  let banner = document.getElementById("checkout-error");

  if (!banner) {
    banner = document.createElement("p");
    banner.id = "checkout-error";
    banner.style.color = "#c0392b";
    banner.style.marginTop = "12px";
    checkoutForm.prepend(banner);
  }

  banner.textContent = message;
}

function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `FE-${stamp}${random}`;
}

async function placeOrder(formData, cart, subtotal) {
  const items = cart.map((item) => ({
    id: item.id,
    name: item.name,
    price: FashionCart.parsePrice(item.price),
    quantity: item.quantity,
    color: item.color || "",
    size: item.size || "",
  }));

  const orderNumber = generateOrderNumber();

  const order = {
    order_number: orderNumber,
    customer_name: formData.get("name"),
    customer_email: formData.get("email"),
    customer_phone: formData.get("phone"),
    shipping_address: formData.get("address"),
    city: formData.get("city"),
    postal_code: formData.get("postal"),
    payment_method: formData.get("payment"),
    notes: formData.get("notes") || "",
    items,
    subtotal,
    total: subtotal,
    status: "Pending",
  };

  // Guests can create an order but are not allowed to read orders back
  // (only a logged-in admin can), so we don't ask Supabase to return the
  // inserted row — asking for it back would trip the SELECT policy and
  // fail the whole insert. We already know the order number because we
  // generated it above.
  const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Order could not be placed (${response.status}): ${message}`);
  }

  return { order_number: orderNumber };
}

checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = checkoutForm.querySelector(".place-order");
  const cart = FashionCart.getCart();
  const subtotal = FashionCart.getSubtotal();
  const formData = new FormData(checkoutForm);

  submitButton.disabled = true;
  submitButton.textContent = "Placing order...";

  try {
    const saved = await placeOrder(formData, cart, subtotal);

    FashionCart.clearCart();

    checkoutForm.innerHTML = `
      <section class="checkout-panel order-complete">
        <h2>Order placed</h2>
        <p>Thank you. Your order ${
          saved?.order_number ? `<strong>#${saved.order_number}</strong> ` : ""
        }has been received and Fashion Essentials will contact you to confirm delivery.</p>
        <a class="cart-link" href="shop.html">Continue Shopping</a>
      </section>
    `;

    checkoutItems.innerHTML = "";
    checkoutSubtotal.textContent = FashionCart.formatPrice(0);
    checkoutTotal.textContent = FashionCart.formatPrice(0);
  } catch (error) {
    console.error(error);
    showError(
      "We could not place your order. Please check your connection and try again."
    );
    submitButton.disabled = false;
    submitButton.textContent = "Place Order";
  }
});

renderCheckout();
