import axios from "axios";

const memoryCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

function readStorage(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.time > CACHE_TTL_MS) {
      sessionStorage.removeItem(key);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeStorage(key, entry) {
  try {
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Ignore quota errors
  }
}

export async function cachedGet(url, config = {}) {
  const cacheKey = `api:${url}`;

  const memoryEntry = memoryCache.get(cacheKey);
  if (memoryEntry && Date.now() - memoryEntry.time < CACHE_TTL_MS) {
    return memoryEntry.data;
  }

  const storedEntry = readStorage(cacheKey);
  if (storedEntry) {
    memoryCache.set(cacheKey, storedEntry);
    return storedEntry.data;
  }

  const response = await axios.get(url, config);
  const entry = { data: response.data, time: Date.now() };
  memoryCache.set(cacheKey, entry);
  writeStorage(cacheKey, entry);
  return response.data;
}

export function clearApiCache() {
  memoryCache.clear();
}
