const loadedImages = new Set();
const preloadPromises = new Map();

export function isImageCached(src) {
  return Boolean(src && loadedImages.has(src));
}

export function markImageCached(src) {
  if (src) loadedImages.add(src);
}

export function preloadImage(src) {
  if (!src || loadedImages.has(src)) {
    return Promise.resolve();
  }

  if (preloadPromises.has(src)) {
    return preloadPromises.get(src);
  }

  const promise = new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      markImageCached(src);
      preloadPromises.delete(src);
      resolve();
    };
    img.onerror = () => {
      preloadPromises.delete(src);
      resolve();
    };
    img.src = src;
  });

  preloadPromises.set(src, promise);
  return promise;
}

async function preloadBatch(urls, concurrency = 3) {
  const queue = [...urls];

  while (queue.length) {
    const batch = queue.splice(0, concurrency);
    await Promise.all(batch.map(preloadImage));
  }
}

export function preloadImages(urls = [], options = {}) {
  const { first = 0, concurrency = 3 } = options;
  const unique = [...new Set(urls.filter(Boolean))];

  if (!unique.length) {
    return Promise.resolve();
  }

  if (!first || first >= unique.length) {
    return preloadBatch(unique, concurrency);
  }

  const priority = unique.slice(0, first);
  const deferred = unique.slice(first);

  return preloadBatch(priority, concurrency).then(() => {
    if (deferred.length) {
      preloadBatch(deferred, concurrency);
    }
  });
}
