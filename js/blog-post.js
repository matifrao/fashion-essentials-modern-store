/* Add this to blog.css — Table of Contents box */

.blog-toc {
  border: 1px solid #e6e9ee;
  border-radius: 10px;
  background: #f9f8fc;
  padding: 18px 20px;
  margin: 24px 0 32px;
}

.blog-toc__title {
  display: block;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--fashion-gold, #b48a3f);
  margin-bottom: 10px;
}

.blog-toc ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 6px;
}

.blog-toc a {
  text-decoration: none;
  color: var(--text-main, #1a1a1a);
  font-size: 14.5px;
  line-height: 1.4;
}

.blog-toc a:hover {
  text-decoration: underline;
  color: var(--fashion-gold, #b48a3f);
}

.toc-item--h3 {
  padding-left: 18px;
  font-size: 13.5px;
}

/* Offset anchored scroll position so headings aren't hidden under a sticky navbar */
.blog-post-body h2[id],
.blog-post-body h3[id] {
  scroll-margin-top: 90px;
}