/*==========================================================
  Fashion Essentials
  File: image-compress.js
  Description: Client-side image resize/compression before
  upload, using the browser's Canvas API. Runs automatically
  for every image uploaded through supabase.upload(), so no
  individual admin page needs to think about this.
==========================================================*/

const MAX_DIMENSION = 1600; // longest side, in pixels — plenty for full-bleed hero use
const QUALITY = 0.8; // 0–1, WebP quality
const SKIP_TYPES = new Set(["image/gif"]); // animated GIFs would be flattened by canvas — leave untouched

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (error) => {
      URL.revokeObjectURL(url);
      reject(error);
    };
    img.src = url;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas encoding failed."))),
      type,
      quality
    );
  });
}

/**
 * Resizes (if needed) and re-encodes an image file as WebP before upload.
 * Falls back to the original file untouched if anything goes wrong, or
 * if the file type isn't safe to run through canvas (e.g. animated GIF).
 */
export async function compressImage(file, options = {}) {
  const maxDimension = options.maxDimension || MAX_DIMENSION;
  const quality = options.quality ?? QUALITY;

  if (!file.type.startsWith("image/") || SKIP_TYPES.has(file.type)) {
    return file;
  }

  try {
    const img = await loadImage(file);

    let { width, height } = img;
    if (width > maxDimension || height > maxDimension) {
      if (width >= height) {
        height = Math.round((height / width) * maxDimension);
        width = maxDimension;
      } else {
        width = Math.round((width / height) * maxDimension);
        height = maxDimension;
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await canvasToBlob(canvas, "image/webp", quality);

    // Only use the compressed version if it's actually smaller —
    // tiny/already-optimized images sometimes don't shrink further.
    if (blob.size >= file.size) {
      return file;
    }

    const newName = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], newName, { type: "image/webp" });
  } catch (error) {
    console.warn("Image compression skipped, using original file:", error.message);
    return file;
  }
}