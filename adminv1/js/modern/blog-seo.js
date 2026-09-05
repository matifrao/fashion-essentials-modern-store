// adminv1/js/modern/blog-seo.js
// Reusable SEO analysis + live-preview helpers for the blog editor.
// Pure functions only — no DOM access here, so it's easy to test/reuse.

export function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Returns "neutral" | "bad" | "warn" | "good" for a text length against a target range.
export function lengthStatus(len, min, max) {
  if (!len) return "neutral";
  if (len < min || len > max) return "bad";
  const softMin = min + Math.round((max - min) * 0.15);
  const softMax = max - Math.round((max - min) * 0.15);
  if (len < softMin || len > softMax) return "warn";
  return "good";
}

export function analyzeReadability(contentHtml) {
  const text = stripHtml(contentHtml);
  const words = text.split(" ").filter(Boolean);
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  const paragraphs = String(contentHtml || "")
    .split(/<\/p>|\n{2,}/i)
    .map((p) => stripHtml(p))
    .filter(Boolean);

  const avgSentenceLength = sentences.length ? words.length / sentences.length : 0;
  const longSentences = sentences.filter((s) => s.split(" ").filter(Boolean).length > 25).length;
  const longParagraphs = paragraphs.filter((p) => p.split(" ").filter(Boolean).length > 150).length;
  const passiveCount = (text.match(/\b(is|are|was|were|been|being|be)\s+\w+ed\b/gi) || []).length;

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    avgSentenceLength,
    longSentences,
    longParagraphs,
    passiveCount,
  };
}

export function keywordChecks(keyword, { title, slug, metaDescription, contentHtml }) {
  if (!keyword || !keyword.trim()) return [];
  const kw = keyword.toLowerCase().trim();
  const kwSlug = kw.replace(/\s+/g, "-");
  const plainContent = stripHtml(contentHtml).toLowerCase();
  const firstChunk = plainContent.split(" ").slice(0, 120).join(" ");

  return [
    { label: "Focus keyword appears in the title", pass: (title || "").toLowerCase().includes(kw) },
    { label: "Focus keyword appears in the URL", pass: (slug || "").toLowerCase().includes(kwSlug) },
    { label: "Focus keyword appears in the meta description", pass: (metaDescription || "").toLowerCase().includes(kw) },
    { label: "Focus keyword appears early in the content", pass: firstChunk.includes(kw) },
    { label: "Focus keyword appears in the body content", pass: plainContent.includes(kw) },
  ];
}

export function readabilityChecks(stats) {
  return [
    {
      label: "Sentences are a reasonable length",
      pass: stats.longSentences === 0,
      hint: stats.longSentences > 0 ? `${stats.longSentences} sentence(s) over 25 words — consider splitting them up.` : "",
    },
    {
      label: "Paragraphs are a reasonable length",
      pass: stats.longParagraphs === 0,
      hint: stats.longParagraphs > 0 ? `${stats.longParagraphs} paragraph(s) over 150 words — consider breaking them up.` : "",
    },
    {
      label: "Limited use of passive voice",
      pass: stats.passiveCount <= 3,
      hint: stats.passiveCount > 3 ? `${stats.passiveCount} possible passive-voice phrase(s) found.` : "",
    },
    {
      label: "Content has enough length for search engines",
      pass: stats.wordCount >= 300,
      hint: stats.wordCount < 300 ? `Only ${stats.wordCount} words — aim for at least 300 words.` : "",
    },
  ];
}

export function checklistItemHtml({ label, pass, hint }) {
  const icon = pass ? "✅" : "⚠️";
  const cls = pass ? "seo-check seo-check--pass" : "seo-check seo-check--warn";
  return `<div class="${cls}"><span class="seo-check__icon">${icon}</span><div><div>${label}</div>${hint ? `<small>${hint}</small>` : ""}</div></div>`;
}

// One-time injected styles for the SEO panel — kept self-contained so we don't
// need to touch the shared admin stylesheet.
export const SEO_PANEL_STYLES = `
<style id="seo-panel-styles">
  .seo-panel { border-top: 1px solid #e6e9ee; padding-top: 14px; margin-top: 14px; }
  .seo-count { font-weight: 400; font-size: 12px; margin-left: 6px; }
  .seo-count--neutral { color: #8a8f98; }
  .seo-count--good { color: #1a7f37; }
  .seo-count--warn { color: #b98900; }
  .seo-count--bad { color: #d1242f; }
  .seo-url-preview { font-size: 13px; color: #57606a; background: #f6f8fa; border: 1px solid #e6e9ee; border-radius: 6px; padding: 8px 10px; word-break: break-all; }
  .google-preview { border: 1px solid #e6e9ee; border-radius: 8px; padding: 12px 14px; background: #fff; font-family: arial, sans-serif; }
  .google-preview__title { color: #1a0dab; font-size: 18px; line-height: 1.3; margin-bottom: 2px; }
  .google-preview__url { color: #006621; font-size: 13px; margin-bottom: 4px; }
  .google-preview__desc { color: #4d5156; font-size: 13px; line-height: 1.4; }
  .seo-advanced { border: 1px solid #e6e9ee; border-radius: 8px; padding: 10px 14px; margin-top: 10px; }
  .seo-advanced summary { cursor: pointer; font-weight: 600; }
  .seo-advanced[open] summary { margin-bottom: 10px; }
  .seo-checklist { margin-top: 12px; display: flex; flex-direction: column; gap: 8px; }
  .seo-check { display: flex; gap: 8px; align-items: flex-start; font-size: 13px; }
  .seo-check small { display: block; color: #8a8f98; margin-top: 2px; }
  .seo-check--pass { color: #1a7f37; }
  .seo-check--warn { color: #b98900; }
  .seo-check__icon { flex-shrink: 0; }
</style>
`;