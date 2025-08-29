// lib/cache.ts
import { redis } from ".";

export type CacheOptions = {
  /** TTL (segundos) – tempo de vida do cache */
  ttl?: number;
  /** TTL suave (segundos) – para SWR */
  softTtl?: number;
};

export async function cacheGet<T = unknown>(key: string): Promise<T | null> {
  const raw = await redis.get<string>(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds?: number
) {
  const payload = JSON.stringify(value);
  if (ttlSeconds && ttlSeconds > 0) {
    await redis.set(key, payload, { ex: ttlSeconds });
  } else {
    await redis.set(key, payload);
  }
}

/** Padrão get-or-set com TTL e lock opcional para evitar stampede */
export async function cacheGetOrSet<T = unknown>(
  key: string,
  producer: () => Promise<T>,
  { ttl = 60 }: CacheOptions = {}
): Promise<{ data: T; fromCache: boolean }> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) return { data: cached, fromCache: true };

  // Lock simples (anti thundering herd)
  const lockKey = `${key}:lock`;
  const lockOk = await redis.set(lockKey, "1", { nx: true, ex: 30 });
  if (!lockOk) {
    // outro worker está gerando; pequena espera + retry
    await sleep(150);
    const retry = await cacheGet<T>(key);
    if (retry !== null) return { data: retry, fromCache: true };
    // Se ainda não tiver, segue sem lock mesmo (melhor servir do origin do que travar)
  }

  try {
    const fresh = await producer();
    await cacheSet(key, fresh, ttl);
    return { data: fresh, fromCache: false };
  } finally {
    // libera lock (deixa expirar naturalmente; opcionalmente del)
    // await redis.del(lockKey);
  }
}

export function cacheKey(
  parts: Array<string | number | boolean | null | undefined>
) {
  return parts.filter((p) => p !== undefined && p !== null).join(":");
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Versão SWR: entrega cache "suave" e revalida ao fundo */
export async function cacheGetOrRevalidate<T = unknown>(
  key: string,
  producer: () => Promise<T>,
  { softTtl = 30, ttl = 300 }: CacheOptions = {}
): Promise<{ data: T; revalidating: boolean }> {
  const metaKey = `${key}:meta`; // guarda timestamp da última geração
  const [cached, meta] = await Promise.all([
    cacheGet<T>(key),
    cacheGet<{ ts: number }>(metaKey),
  ]);

  const now = Date.now();
  const isStale = !meta || now - meta.ts > softTtl * 1000;

  if (cached !== null) {
    // serve o cache e, se estiver stale, revalida por trás (fire-and-forget)
    if (isStale)
      void (async () => {
        const fresh = await producer();
        await cacheSet(key, fresh, ttl);
        await cacheSet(metaKey, { ts: Date.now() }, ttl);
      })();
    return { data: cached, revalidating: isStale };
  }

  const fresh = await producer();
  await cacheSet(key, fresh, ttl);
  await cacheSet(metaKey, { ts: Date.now() }, ttl);
  return { data: fresh, revalidating: false };
}
