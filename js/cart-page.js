const cartItems = document.getElementById("cart-items");
const cartSummary = document.getElementById("cart-summary");
const subtotal = document.getElementById("subtotal");
const total = document.getElementById("total");
const checkout = document.getElementById("checkout");

function renderCart() {
  const cart = FashionCart.getCart();

  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Browse the collection and add your favorite modest essentials.</p>
        <a class="cart-link" href="shop.html">Continue Shopping</a>
      </div>
    `;
    cartSummary.classList.add("hidden");
    return;
  }

  cartSummary.classList.remove("hidden");

  cartItems.innerHTML = cart
    .map((item) => {
      const itemTotal = FashionCart.parsePrice(item.price) * item.quantity;

      return `
        <article class="cart-item">
          <div>
            <h2>${item.name}</h2>
            ${
              item.color || item.size
                ? `<p class="cart-item-variant">${[item.color, item.size]
                    .filter(Boolean)
                    .join(" · ")}</p>`
                : ""
            }
            <p>${item.price}</p>
          </div>

          <div class="quantity-control" aria-label="Quantity for ${item.name}">
            <button type="button" data-action="decrease" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button type="button" data-action="increase" data-id="${item.id}">+</button>
          </div>

          <strong>${FashionCart.formatPrice(itemTotal)}</strong>

          <button class="remove-item" type="button" data-action="remove" data-id="${item.id}">
            Remove
          </button>
        </article>
      `;
    })
    .join("");

  const subtotalAmount = FashionCart.getSubtotal();

  subtotal.textContent = FashionCart.formatPrice(subtotalAmount);
  total.textContent = FashionCart.formatPrice(subtotalAmount);
  FashionCart.updateCartCount();
}

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) return;

  const cart = FashionCart.getCart();
  const item = cart.find((cartItem) => cartItem.id === button.dataset.id);

  if (!item) return;

  if (button.dataset.action === "increase") {
    FashionCart.setQuantity(item.id, item.quantity + 1);
  }

  if (button.dataset.action === "decrease") {
    FashionCart.setQuantity(item.id, item.quantity - 1);
  }

  if (button.dataset.action === "remove") {
    FashionCart.removeItem(item.id);
  }

  renderCart();
});

checkout.addEventListener("click", () => {
  window.location.href = "checkout.html";
});

renderCart();
