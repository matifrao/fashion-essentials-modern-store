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

function ensureMetaKeywordsTag() {
  let el = document.querySelector('meta[name="keywords"]');
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", "keywords");
    document.head.appendChild(el);
  }
  return el;
}

function updateSeoTags(post, authorName) {
  const url = `https://www.fashionessentials.store/blog-post.html?slug=${encodeURIComponent(post.slug)}`;
  const title = post.metaTitle || `${post.title} | Fashion Essentials`;
  const description = post.metaDescription || FashionBlog.excerpt(post, 155);
  const image = post.featuredImage || "https://www.fashionessentials.store/images/ChatGPT%20Image%20Jun%2016%2C%202026%2C%2004_20_38%20PM.png";

  const socialTitle = post.ogTitle || title;
  const socialDescription = post.ogDescription || description;
  const socialImage = post.ogImage || image;

  document.title = title;

  setMeta('meta[name="description"]', "content", description);
  setMeta('link[rel="canonical"]', "href", url);

  if (post.metaKeywords) {
    ensureMetaKeywordsTag().setAttribute("content", post.metaKeywords);
  }

  setMeta('meta[property="og:title"]', "content", socialTitle);
  setMeta('meta[property="og:description"]', "content", socialDescription);
  setMeta('meta[property="og:url"]', "content", url);
  setMeta('meta[property="og:image"]', "content", socialImage);

  setMeta('meta[name="twitter:title"]', "content", socialTitle);
  setMeta('meta[name="twitter:description"]', "content", socialDescription);
  setMeta('meta[name="twitter:image"]', "content", socialImage);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": description,
    "image": image ? [image] : [],
    "author": {
      "@type": "Person",
      "name": authorName || "Fashion Essentials",
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

function relatedPostCardHtml(post) {
  const image = post.featuredImage
    ? `<img src="${post.featuredImage}" alt="${post.imageAlt || post.title}">`
    : "";
  return `
    <a class="related-post-card" href="blog-post.html?slug=${encodeURIComponent(post.slug)}">
      ${image}
      <div class="related-post-card__body">
        <span>${formatDate(post.createdAt)}</span>
        <h3>${post.title}</h3>
      </div>
    </a>
  `;
}

async function renderRelatedPosts(post) {
  const container = document.getElementById("related-posts");
  if (!container) return;

  const related = await FashionBlog.getRelatedPosts(post.category, post.slug, 3);
  if (!related.length) {
    container.remove();
    return;
  }

  container.innerHTML = `
    <h2>Related posts</h2>
    <div class="related-posts-grid">
      ${related.map(relatedPostCardHtml).join("")}
    </div>
  `;
}

function renderPost(post, settings) {
  updateSeoTags(post, settings.authorName);

  const image = post.featuredImage
    ? `
      <figure class="blog-post-figure">
        <img class="blog-post-image" src="${post.featuredImage}" alt="${post.imageAlt || post.title}">
        ${post.imageCaption ? `<figcaption>${post.imageCaption}</figcaption>` : ""}
      </figure>
    `
    : "";

  const bylineName = settings.authorName || "Fashion Essentials";
  const authorBio = settings.authorBio
    ? `<p class="blog-post-author-bio">${settings.authorBio}</p>`
    : "";

  detail.innerHTML = `
    <header class="blog-post-header">
      <span>${formatDate(post.createdAt)}</span>
      <h1>${post.title}</h1>
      <p class="blog-post-meta">By ${bylineName}</p>
      ${authorBio}
    </header>

    ${image}

    <div class="blog-post-body">${post.content}</div>

    <section id="related-posts" class="related-posts"></section>
  `;

  renderRelatedPosts(post);
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
  Promise.all([FashionBlog.getPost(slug), FashionBlog.getSiteSettings()])
    .then(([post, settings]) => {
      if (post) renderPost(post, settings);
      else renderNotFound();
    })
    .catch((error) => {
      console.error(error);
      renderNotFound();
    });
}