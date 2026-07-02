async function loadComponent(id, file) {
  const element = document.getElementById(id);

  if (!element) return;

  const response = await fetch(file);
  element.innerHTML = await response.text();
}

// Load shared components
loadComponent("navbar", "components/navbar.html");
loadComponent("footer", "components/footer.html");