import axios from "axios";

const memoryCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

function clearLegacySessionCache() {
  try {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("api:")) {
        sessionStorage.removeItem(key);
      }
    });
  } catch {
    // Ignore storage access errors
  }
}

clearLegacySessionCache();

export async function cachedGet(url, config = {}) {
  const cacheKey = `api:${url}`;

  const memoryEntry = memoryCache.get(cacheKey);
  if (memoryEntry && Date.now() - memoryEntry.time < CACHE_TTL_MS) {
    return memoryEntry.data;
  }

  const response = await axios.get(url, config);
  const entry = { data: response.data, time: Date.now() };
  memoryCache.set(cacheKey, entry);
  return response.data;
}

export function clearApiCache() {
  memoryCache.clear();
}
