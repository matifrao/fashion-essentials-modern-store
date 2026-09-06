function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function postCardHtml(post) {
  const image = post.featuredImage
    ? `<img src="${post.featuredImage}" alt="${post.imageAlt || post.title}">`
    : "";

  return `
    <a class="blog-card" href="blog-post.html?slug=${encodeURIComponent(post.slug)}">
      ${image}
      <div class="blog-card-body">
        ${post.category ? `<span>${post.category}</span>` : ""}
        <h2>${post.title}</h2>
        <p>${FashionBlog.excerpt(post, 110)}</p>
      </div>
    </a>
  `;
}

async function renderBlogGrid() {
  const grid = document.getElementById("blog-grid");
  if (!grid) return;

  try {
    const posts = await FashionBlog.getPosts();

    grid.innerHTML = posts.length
      ? posts.map(postCardHtml).join("")
      : `<div class="empty-state"><p>No blog posts published yet — check back soon.</p></div>`;
  } catch (error) {
    console.error(error);
    grid.innerHTML = `<div class="empty-state"><p>Couldn't load blog posts right now. Please try again shortly.</p></div>`;
  }
}

renderBlogGrid();