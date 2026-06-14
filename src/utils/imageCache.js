import { optimizeImageUrl } from "./optimizeImage";

const loadedImages = new Set();
const preloadPromises = new Map();

export function isImageCached(src) {
  return Boolean(src && loadedImages.has(src));
}

export function markImageCached(src) {
  if (src) loadedImages.add(src);
}

function getPreloadKey(src, size) {
  return `${size}::${src}`;
}

export function preloadImage(src, size = "card") {
  if (!src || loadedImages.has(src)) {
    return Promise.resolve();
  }

  const optimizedSrc = optimizeImageUrl(src, size);
  const cacheKey = getPreloadKey(src, size);

  if (preloadPromises.has(cacheKey)) {
    return preloadPromises.get(cacheKey);
  }

  const promise = new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      markImageCached(src);
      markImageCached(optimizedSrc);
      preloadPromises.delete(cacheKey);
      resolve();
    };
    img.onerror = () => {
      preloadPromises.delete(cacheKey);
      resolve();
    };
    img.src = optimizedSrc;
  });

  preloadPromises.set(cacheKey, promise);
  return promise;
}

async function preloadBatch(urls, concurrency = 3, size = "card") {
  const queue = [...urls];

  while (queue.length) {
    const batch = queue.splice(0, concurrency);
    await Promise.all(batch.map((url) => preloadImage(url, size)));
  }
}

export function preloadImages(urls = [], options = {}) {
  const { first = 0, concurrency = 3, size = "card" } = options;
  const unique = [...new Set(urls.filter(Boolean))];

  if (!unique.length) {
    return Promise.resolve();
  }

  if (!first || first >= unique.length) {
    return preloadBatch(unique, concurrency, size);
  }

  const priority = unique.slice(0, first);
  const deferred = unique.slice(first);

  return preloadBatch(priority, concurrency, size).then(() => {
    if (deferred.length) {
      preloadBatch(deferred, concurrency, size);
    }
  });
}
