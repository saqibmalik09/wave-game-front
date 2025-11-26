const cacheStore = new Map<string, any>();

// Safe check for browser/localStorage
function canUseLocalStorage(): boolean {
  try {
    return (
      typeof window !== "undefined" &&
      typeof localStorage !== "undefined"
    );
  } catch {
    return false;
  }
}

// GET
export function getCache<T = any>(key: string): T | null {
  // RAM first
  if (cacheStore.has(key)) return cacheStore.get(key);

  // Browser localStorage
  if (canUseLocalStorage()) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      cacheStore.set(key, parsed);
      return parsed;
    } catch {
      // Ignore error — return RAM only
      return null;
    }
  }

  return null;
}

// SET
export function setCache<T = any>(key: string, value: T): void {
  cacheStore.set(key, value);

  if (canUseLocalStorage()) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage errors (e.g. WebView restricted mode)
    }
  }
}

// CHECK
export function hasCache(key: string): boolean {
  return cacheStore.has(key) || (canUseLocalStorage() && localStorage.getItem(key) !== null);
}
