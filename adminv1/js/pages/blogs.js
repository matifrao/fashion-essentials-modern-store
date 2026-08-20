import { blogsApi, authApi } from "../core/api.js";
const form = document.getElementById("blogForm"), list = document.getElementById("blogList"), del = document.getElementById("deletePost");
const fields = { id: document.getElementById("postId"), title: document.getElementById("title"), slug: document.getElementById("slug"), status: document.getElementById("status"), content: document.getElementById("content") };
let posts = [];
const clear = () => { form.reset(); fields.id.value = ""; del.hidden = true; };
function render() { list.innerHTML = posts.length ? posts.map(post => `<button data-id="${post.id}"><strong>${escapeHtml(post.title || post.name)}</strong><small>${post.status || "Draft"}</small></button>`).join("") : "No blog posts yet."; list.querySelectorAll("button").forEach(button => button.onclick = () => load(button.dataset.id)); }
const escapeHtml = value => String(value || "").replace(/[&<>'"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[char]));
function load(id) { const post = posts.find(item => item.id === id); if (!post) return; fields.id.value = post.id; fields.title.value = post.title || post.name || ""; fields.slug.value = post.slug || ""; fields.status.value = post.status || "Draft"; fields.content.value = post.content || ""; del.hidden = false; }
async function refresh() { posts = await blogsApi.list(); render(); }
fields.title.addEventListener("input", () => { if (!fields.slug.value) fields.slug.value = fields.title.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); });
form.addEventListener("submit", async event => { event.preventDefault(); const post = { title: fields.title.value.trim(), name: fields.title.value.trim(), slug: fields.slug.value.trim(), status: fields.status.value, content: fields.content.value.trim() }; if (fields.id.value) await blogsApi.update(fields.id.value, post); else await blogsApi.create(post); clear(); await refresh(); });
del.addEventListener("click", async () => { if (fields.id.value && confirm("Delete this post?")) { await blogsApi.delete(fields.id.value); clear(); await refresh(); } });
document.getElementById("newPost").onclick = clear;
authApi.me().then(refresh).catch(() => location.href = "login.html");
