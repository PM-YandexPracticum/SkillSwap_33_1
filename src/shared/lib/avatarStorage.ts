const AVATARS_DATA_KEY = 'avatars_data';
const AVATARS_META_KEY = 'avatars_meta';
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

interface AvatarMeta {
  userId: string;
  size: number;
  lastAccess: number;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function loadJSON<T>(key: string, def: T): T {
  if (!isBrowser()) return def;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : def;
  } catch {
    return def;
  }
}

function saveJSON(key: string, data: any): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(data));
}

async function compressToDataURL(input: File | string, maxWidth = 200): Promise<string> {
  if (typeof input === 'string' && !input.startsWith('data:')) {
    // regular URL, return as is
    return input;
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    const cleanup = () => {
      if (typeof input !== 'string') URL.revokeObjectURL(img.src);
    };
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, w, h);
      cleanup();
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = (e) => {
      cleanup();
      reject(e);
    };
    if (typeof input === 'string') {
      img.src = input;
    } else {
      const url = URL.createObjectURL(input);
      img.src = url;
    }
  });
}

export function getAvatar(userId: string): string | null {
  const data = loadJSON<Record<string, string>>(AVATARS_DATA_KEY, {});
  const meta = loadJSON<AvatarMeta[]>(AVATARS_META_KEY, []);
  if (!(userId in data)) return null;
  const now = Date.now();
  const item = meta.find((m) => m.userId === userId);
  if (item) {
    item.lastAccess = now;
    saveJSON(AVATARS_META_KEY, meta);
  }
  return data[userId];
}

export async function setAvatar(userId: string, input: File | string): Promise<void> {
  const data = loadJSON<Record<string, string>>(AVATARS_DATA_KEY, {});
  const meta = loadJSON<AvatarMeta[]>(AVATARS_META_KEY, []);
  const dataURL = await compressToDataURL(input);
  const size = Math.round((dataURL.length * 3) / 4);
  data[userId] = dataURL;
  const now = Date.now();
  const existing = meta.find((m) => m.userId === userId);
  if (existing) {
    existing.size = size;
    existing.lastAccess = now;
  } else {
    meta.push({ userId, size, lastAccess: now });
  }
  let total = meta.reduce((sum, m) => sum + m.size, 0);
  if (total > MAX_BYTES) {
    meta.sort((a, b) => a.lastAccess - b.lastAccess);
    while (total > MAX_BYTES && meta.length) {
      const evicted = meta.shift()!;
      delete data[evicted.userId];
      total -= evicted.size;
    }
  }
  saveJSON(AVATARS_DATA_KEY, data);
  saveJSON(AVATARS_META_KEY, meta);
}

export function removeAvatar(userId: string): void {
  const data = loadJSON<Record<string, string>>(AVATARS_DATA_KEY, {});
  const meta = loadJSON<AvatarMeta[]>(AVATARS_META_KEY, []);
  if (userId in data) {
    delete data[userId];
    saveJSON(AVATARS_DATA_KEY, data);
  }
  const idx = meta.findIndex((m) => m.userId === userId);
  if (idx !== -1) {
    meta.splice(idx, 1);
    saveJSON(AVATARS_META_KEY, meta);
  }
}
