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

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  FashionCart.clearCart();

  checkoutForm.innerHTML = `
    <section class="checkout-panel order-complete">
      <h2>Order placed</h2>
      <p>Thank you. Your order has been received and Fashion Essentials will contact you to confirm delivery.</p>
      <a class="cart-link" href="shop.html">Continue Shopping</a>
    </section>
  `;

  checkoutItems.innerHTML = "";
  checkoutSubtotal.textContent = FashionCart.formatPrice(0);
  checkoutTotal.textContent = FashionCart.formatPrice(0);
});

renderCheckout();
