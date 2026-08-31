const grid = document.getElementById("blog-grid");

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderPosts(posts) {
  if (!posts.length) {
    grid.innerHTML = `<p class="empty-state">No blog posts yet — check back soon.</p>`;
    return;
  }

  grid.innerHTML = posts
    .map((post) => {
      const image = post.featuredImage || "images/Roundnew.jpg";
      const alt = post.imageAlt || post.title;

      return `
        <article class="blog-card">
          <a href="blog-post.html?slug=${encodeURIComponent(post.slug)}">
            <img src="${image}" alt="${alt}" loading="lazy">
          </a>
          <div class="blog-card-body">
            <span>${formatDate(post.createdAt)}</span>
            <a href="blog-post.html?slug=${encodeURIComponent(post.slug)}">
              <h2>${post.title}</h2>
            </a>
            <p>${FashionBlog.excerpt(post)}</p>
          </div>
        </article>
      `;
    })
    .join("");
}

FashionBlog.getPosts()
  .then(renderPosts)
  .catch((error) => {
    grid.innerHTML = `<p class="empty-state">Couldn't load blog posts right now.</p>`;
    console.error(error);
  });