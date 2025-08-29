// lib/redis.ts
import { Redis } from "@upstash/redis";

// Opção 1: explícito
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Opção 2: se preferir, usa fromEnv()
// export const redis = Redis.fromEnv();
