const FashionCart = (() => {
  const storageKey = "cart";

  function parsePrice(price) {
    return Number(String(price).replace(/[^\d]/g, "")) || 0;
  }

  function formatPrice(amount) {
    return `PKR ${amount.toLocaleString("en-PK")}`;
  }

  function getCart() {
    const savedCart = JSON.parse(localStorage.getItem(storageKey)) || [];

    return savedCart.map((item) => ({
      id: item.id || item.name,
      name: item.name,
      price: item.price,
      quantity: Number(item.quantity) || 1,
    }));
  }

  function saveCart(cart) {
    localStorage.setItem(storageKey, JSON.stringify(cart));
    updateCartCount();
  }

  function addItem(product) {
    const cart = getCart();
    const productId = product.id || product.name;
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
    }

    saveCart(cart);
  }

  function setQuantity(productId, quantity) {
    const nextCart = getCart()
      .map((item) =>
        item.id === productId ? { ...item, quantity: Number(quantity) } : item
      )
      .filter((item) => item.quantity > 0);

    saveCart(nextCart);
  }

  function removeItem(productId) {
    saveCart(getCart().filter((item) => item.id !== productId));
  }

  function clearCart() {
    saveCart([]);
  }

  function getSubtotal() {
    return getCart().reduce(
      (total, item) => total + parsePrice(item.price) * item.quantity,
      0
    );
  }

  function getCount() {
    return getCart().reduce((total, item) => total + item.quantity, 0);
  }

  function updateCartCount() {
    const count = document.getElementById("cart-count");

    if (count) {
      count.textContent = getCount();
    }
  }

  return {
    addItem,
    clearCart,
    formatPrice,
    getCart,
    getCount,
    getSubtotal,
    parsePrice,
    removeItem,
    setQuantity,
    updateCartCount,
  };
})();

document.addEventListener("click", (event) => {
  const button = event.target.closest(".add-cart");

  if (!button) return;

  FashionCart.addItem({
    id: button.dataset.id || button.dataset.name,
    name: button.dataset.name,
    price: button.dataset.price,
  });

  button.textContent = "Added";

  window.setTimeout(() => {
    button.textContent = "Add to Cart";
  }, 900);
});

document.addEventListener("DOMContentLoaded", FashionCart.updateCartCount);
document.addEventListener("components-loaded", FashionCart.updateCartCount);
