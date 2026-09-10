/**
 * localStorage wrapper that NEVER throws: private-mode / disabled-storage / quota / SSR / node
 * all fall back to a process-lifetime in-memory Map. Reads that fail return the provided default.
 */

type Backing = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function memoryBacking(): Backing {
  const m = new Map<string, string>();
  return {
    getItem: (k) => (m.has(k) ? m.get(k)! : null),
    setItem: (k, v) => void m.set(k, String(v)),
    removeItem: (k) => void m.delete(k),
  };
}

function pickBacking(): Backing {
  try {
    const ls = globalThis.localStorage;
    if (!ls) return memoryBacking();
    const probe = `${'learnai'}:__probe__`;
    ls.setItem(probe, '1');
    ls.removeItem(probe);
    return ls;
  } catch {
    return memoryBacking();
  }
}

const backing: Backing = pickBacking();

export const storage = {
  getString(key: string): string | null {
    try {
      return backing.getItem(key);
    } catch {
      return null;
    }
  },
  setString(key: string, value: string): void {
    try {
      backing.setItem(key, value);
    } catch {
      /* ignore: best-effort persistence */
    }
  },
  remove(key: string): void {
    try {
      backing.removeItem(key);
    } catch {
      /* ignore */
    }
  },
  getJSON<T>(key: string, fallback: T): T {
    const raw = this.getString(key);
    if (raw == null) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  setJSON(key: string, value: unknown): void {
    try {
      this.setString(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  },
};
