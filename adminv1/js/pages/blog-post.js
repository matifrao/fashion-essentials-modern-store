const detail = document.getElementById("blog-post-detail");
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function setMeta(selector, attr, value) {
  const el = document.querySelector(selector);
  if (el && value) el.setAttribute(attr, value);
}

function updateSeoTags(post) {
  const url = `https://www.fashionessentials.store/blog-post.html?slug=${encodeURIComponent(post.slug)}`;
  const title = post.metaTitle || `${post.title} | Fashion Essentials`;
  const description = post.metaDescription || FashionBlog.excerpt(post, 155);
  const image = post.featuredImage || "https://www.fashionessentials.store/images/ChatGPT%20Image%20Jun%2016%2C%202026%2C%2004_20_38%20PM.png";

  document.title = title;

  setMeta('meta[name="description"]', "content", description);
  setMeta('link[rel="canonical"]', "href", url);

  setMeta('meta[property="og:title"]', "content", title);
  setMeta('meta[property="og:description"]', "content", description);
  setMeta('meta[property="og:url"]', "content", url);
  setMeta('meta[property="og:image"]', "content", image);

  setMeta('meta[name="twitter:title"]', "content", title);
  setMeta('meta[name="twitter:description"]', "content", description);
  setMeta('meta[name="twitter:image"]', "content", image);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": description,
    "image": image ? [image] : [],
    "author": {
      "@type": "Organization",
      "name": "Fashion Essentials",
      "url": "https://www.fashionessentials.store/",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Fashion Essentials",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.fashionessentials.store/images/ChatGPT%20Image%20Jun%2016%2C%202026%2C%2004_20_38%20PM.png",
      },
    },
    "datePublished": post.createdAt || undefined,
    "dateModified": post.updatedAt || post.createdAt || undefined,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url,
    },
  };

  const schemaEl = document.getElementById("article-schema");
  if (schemaEl) schemaEl.textContent = JSON.stringify(schema);
}

function renderPost(post) {
  updateSeoTags(post);

  const image = post.featuredImage
    ? `<img class="blog-post-image" src="${post.featuredImage}" alt="${post.imageAlt || post.title}">`
    : "";

  detail.innerHTML = `
    <header class="blog-post-header">
      <span>${formatDate(post.createdAt)}</span>
      <h1>${post.title}</h1>
      <p class="blog-post-meta">By Fashion Essentials</p>
    </header>

    ${image}

    <div class="blog-post-body">${post.content}</div>
  `;
}

function renderNotFound() {
  detail.innerHTML = `
    <div class="empty-state">
      <h1>Post not found</h1>
      <p>This blog post may have been removed or is no longer published.</p>
      <p><a href="blog.html">Back to the blog</a></p>
    </div>
  `;
}

if (!slug) {
  renderNotFound();
} else {
  FashionBlog.getPost(slug)
    .then((post) => {
      if (post) renderPost(post);
      else renderNotFound();
    })
    .catch((error) => {
      console.error(error);
      renderNotFound();
    });
}
