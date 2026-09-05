/*==========================================================*
 * Fashion Essentials
 * File: blogs-data.js
 * Description: Storefront Blog Data
 * Source: Supabase
 *==========================================================*/

const SUPABASE_URL =
  "https://omnlwbmahntspldbzarj.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_ET-KSHRDbelW54DQ_ql-ag_7zAUX5gk";


const FashionBlog = (() => {

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }


  async function request(url, options = {}) {

    const response = await fetch(url, {
      cache: "no-store",
      ...options,
    });

    if (!response.ok) {

      const message = await response.text();

      throw new Error(
        `Request failed (${response.status}): ${message}`
      );
    }

    return response.json();
  }


  function normalizePost(post) {

    const data =
      post.data &&
      typeof post.data === "object"
        ? post.data
        : {};


    const images =
      Array.isArray(post.images)
        ? post.images
        : Array.isArray(data.images)
        ? data.images
        : [];


    return {

      id:
        post.id ||
        slugify(post.name || data.title),

      title:
        post.name ||
        data.title ||
        "",

      slug:
        post.slug ||
        data.slug ||
        "",

      status:
        post.status ||
        data.status ||
        "Draft",

      content:
        data.content ||
        "",

      metaTitle:
        data.metaTitle ||
        "",

      metaDescription:
        data.metaDescription ||
        "",

      featuredImage:
        images[0] ||
        "",

      imageAlt:
        data.imageAlt ||
        "",

      focusKeyword:
        data.focusKeyword ||
        "",

      ogTitle:
        data.ogTitle ||
        "",

      ogDescription:
        data.ogDescription ||
        "",

      ogImage:
        data.ogImage ||
        "",

      createdAt:
        post.created_at ||
        "",

      updatedAt:
        post.updated_at ||
        post.created_at ||
        "",
    };
  }


  async function getPosts() {

    const url =
      `${SUPABASE_URL}/rest/v1/blog_posts` +
      `?select=*` +
      `&status=eq.Published` +
      `&order=created_at.desc`;


    const posts = await request(url, {

      headers: {

        apikey:
          SUPABASE_ANON_KEY,

        Authorization:
          `Bearer ${SUPABASE_ANON_KEY}`,

      },

    });


    return posts.map(normalizePost);
  }


  async function getPost(slug) {

    const url =
      `${SUPABASE_URL}/rest/v1/blog_posts` +
      `?select=*` +
      `&slug=eq.${encodeURIComponent(slug)}` +
      `&status=eq.Published` +
      `&limit=1`;


    const posts = await request(url, {

      headers: {

        apikey:
          SUPABASE_ANON_KEY,

        Authorization:
          `Bearer ${SUPABASE_ANON_KEY}`,

      },

    });


    return posts.length
      ? normalizePost(posts[0])
      : null;
  }


  function excerpt(post, length = 140) {

    const text =
      String(post.content || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();


    return text.length > length
      ? `${text.slice(0, length).trim()}…`
      : text;
  }


  return {

    slugify,

    getPosts,

    getPost,

    excerpt,

  };

})();