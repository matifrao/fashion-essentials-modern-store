// Navbar
fetch("components/navbar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
    document.dispatchEvent(new Event("components-loaded"));
  });

// Footer
fetch("components/footer.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  });

// WhatsApp floating button (site-wide — appended directly to <body>,
// no placeholder div needed on individual pages)
fetch("components/whatsapp.html")
  .then(res => res.text())
  .then(data => {
    document.body.insertAdjacentHTML("beforeend", data);
  });