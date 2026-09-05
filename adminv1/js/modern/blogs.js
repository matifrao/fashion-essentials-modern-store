import { blogsApi, supabase } from "../core/api.js";
import { startShell } from "./shell.js";
import {
  stripHtml,
  lengthStatus,
  analyzeReadability,
  keywordChecks,
  readabilityChecks,
  checklistItemHtml,
  SEO_PANEL_STYLES,
} from "./blog-seo.js";

const $ = (id) => document.getElementById(id);
let posts = [];
let id = "";

const esc = (text) =>
  String(text || "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

const SITE_URL = "https://www.fashionessentials.store";

const view = `
${SEO_PANEL_STYLES}
<div class="page-head">
  <div><h2>Blog posts</h2><p>Create content for your store and search engines.</p></div>
  <button class="btn primary" id="new">+ New post</button>
</div>
<div class="blog-layout">
  <section class="card"><div id="postList"></div></section>
  <section class="card">
    <form id="postForm">
      <h3 id="formTitle">New blog post</h3>

      <div class="field"><label>Post title</label>
        <input id="title" required placeholder="e.g. How to choose the right hijab fabric"></div>

      <div class="field"><label>URL handle</label>
        <input id="slug" required>
        <div class="seo-url-preview" id="urlPreview"></div>
      </div>

      <div class="row">
        <div class="field"><label>Status</label>
          <select id="status"><option>Draft</option><option>Published</option></select></div>
        <div class="field"><label>Featured image</label>
          <input id="image" type="file" accept="image/*"></div>
      </div>

      <div class="field"><label>Image alt text</label>
        <input id="imageAlt" placeholder="Describe the image for search engines and screen readers"></div>

      <div class="field"><label>Article content</label>
        <textarea id="content" required style="min-height:300px"></textarea></div>

      <section class="seo-panel">
        <h3>SEO</h3>

        <div class="field"><label>Focus keyword <small>(optional)</small></label>
          <input id="focusKeyword" placeholder="e.g. chiffon hijab"></div>

        <div class="field"><label>Meta title <span class="seo-count" id="metaTitleCount"></span></label>
          <input id="metaTitle" maxlength="70"></div>

        <div class="field"><label>Meta description <span class="seo-count" id="metaDescriptionCount"></span></label>
          <textarea id="metaDescription" maxlength="160"></textarea></div>

        <div class="field"><label>Google search preview</label>
          <div class="google-preview">
            <div class="google-preview__title" id="gpTitle"></div>
            <div class="google-preview__url" id="gpUrl"></div>
            <div class="google-preview__desc" id="gpDesc"></div>
          </div>
        </div>

        <details class="seo-advanced">
          <summary>Social sharing (Facebook / Twitter)</summary>
          <div class="field"><label>Social share image <small>(optional — uses featured image if empty)</small></label>
            <input id="ogImage" type="file" accept="image/*"></div>
          <div class="field"><label>Social title <small>(optional — uses meta title if empty)</small></label>
            <input id="ogTitle" maxlength="70"></div>
          <div class="field"><label>Social description <small>(optional — uses meta description if empty)</small></label>
            <textarea id="ogDescription" maxlength="160"></textarea></div>
        </details>

        <div class="seo-checklist" id="seoChecklist"></div>
      </section>

      <button class="btn primary" type="submit">Save post</button>
      <button class="btn danger" type="button" id="delete" hidden>Delete</button>
    </form>
  </section>
</div>`;

function clear() {
  id = "";
  $("postForm").reset();
  $("delete").hidden = true;
  $("formTitle").textContent = "New blog post";
  runAnalysis();
}

function render() {
  $("postList").innerHTML = posts.length
    ? posts
        .map(
          (post) =>
            `<button class="post-row" data-id="${post.id}"><strong>${esc(post.title || post.name)}</strong><small>${esc(
              post.status || "Draft"
            )} · ${new Date(post.createdAt || Date.now()).toLocaleDateString()}</small></button>`
        )
        .join("")
    : `<div class="empty">No blog posts yet.</div>`;
  document.querySelectorAll(".post-row").forEach((button) => (button.onclick = () => load(button.dataset.id)));
}

function load(postId) {
  const post = posts.find((item) => item.id === postId);
  if (!post) return;
  id = postId;
  $("formTitle").textContent = "Edit blog post";
  ["title", "slug", "status", "content", "metaTitle", "metaDescription", "imageAlt", "focusKeyword", "ogTitle", "ogDescription"].forEach(
    (key) => ($(key).value = post[key] || "")
  );
  $("delete").hidden = false;
  runAnalysis();
}

async function refresh() {
  posts = await blogsApi.list();
  render();
}

function setCount(inputId, countId, min, max) {
  const value = $(inputId).value || "";
  const status = lengthStatus(value.length, min, max);
  const el = $(countId);
  el.textContent = `${value.length}/${max}`;
  el.className = `seo-count seo-count--${status}`;
}

function updateUrlPreview() {
  const slug = $("slug").value.trim() || "your-post-slug";
  $("urlPreview").textContent = `${SITE_URL}/blog-post.html?slug=${slug}`;
}

function updateGooglePreview() {
  const title = $("metaTitle").value.trim() || $("title").value.trim() || "Your post title";
  const description = $("metaDescription").value.trim() || "Your meta description will appear here.";
  const slug = $("slug").value.trim() || "your-post-slug";
  $("gpTitle").textContent = title.length > 60 ? `${title.slice(0, 60)}…` : title;
  $("gpUrl").textContent = `${SITE_URL}/blog-post.html?slug=${slug}`;
  $("gpDesc").textContent = description.length > 160 ? `${description.slice(0, 160)}…` : description;
}

function updateChecklist() {
  const title = $("title").value.trim();
  const slug = $("slug").value.trim();
  const metaDescription = $("metaDescription").value.trim();
  const contentHtml = $("content").value;
  const focusKeyword = $("focusKeyword").value.trim();

  const stats = analyzeReadability(contentHtml);
  const items = [
    ...keywordChecks(focusKeyword, { title, slug, metaDescription, contentHtml }),
    ...readabilityChecks(stats),
  ];

  $("seoChecklist").innerHTML = items.length
    ? items.map(checklistItemHtml).join("")
    : `<div class="seo-check"><small>Add a focus keyword above to see targeted SEO checks.</small></div>`;
}

function runAnalysis() {
  setCount("metaTitle", "metaTitleCount", 30, 60);
  setCount("metaDescription", "metaDescriptionCount", 70, 160);
  updateUrlPreview();
  updateGooglePreview();
  updateChecklist();
}

function wireLiveAnalysis() {
  ["title", "slug", "metaTitle", "metaDescription", "content", "focusKeyword"].forEach((fieldId) => {
    $(fieldId).addEventListener("input", runAnalysis);
  });
}

async function init() {
  if (!(await startShell("blogs", view))) return;
  await refresh();

  wireLiveAnalysis();
  runAnalysis();

  $("new").onclick = clear;

  $("title").addEventListener("input", () => {
    if (!$("slug").dataset.touched) {
      $("slug").value = $("title")
        .value.toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
  });
  $("slug").addEventListener("input", () => ($("slug").dataset.touched = "true"));

  $("postForm").onsubmit = async (event) => {
    event.preventDefault();
    const file = $("image").files[0];
    const ogFile = $("ogImage").files[0];
    const current = posts.find((post) => post.id === id);

    const post = {
      title: $("title").value.trim(),
      name: $("title").value.trim(),
      slug: $("slug").value.trim(),
      status: $("status").value,
      content: $("content").value.trim(),
      imageAlt: $("imageAlt").value.trim(),
      metaTitle: $("metaTitle").value.trim(),
      metaDescription: $("metaDescription").value.trim(),
      focusKeyword: $("focusKeyword").value.trim(),
      ogTitle: $("ogTitle").value.trim(),
      ogDescription: $("ogDescription").value.trim(),
      ogImage: ogFile ? await supabase.upload(ogFile) : current?.ogImage || "",
      images: file ? [await supabase.upload(file)] : current?.images || [],
    };

    if (id) await blogsApi.update(id, post);
    else await blogsApi.create(post);

    clear();
    await refresh();
  };

  $("delete").onclick = async () => {
    if (id && confirm("Delete this blog post?")) {
      await blogsApi.delete(id);
      clear();
      await refresh();
    }
  };
}

init().catch((error) => alert(error.message));