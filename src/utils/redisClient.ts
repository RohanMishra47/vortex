import { Redis } from "@upstash/redis";

if (!process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error("UPSTASH_REDIS_REST_URL is not defined");
}

if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error("UPSTASH_REDIS_REST_TOKEN is not defined");
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function cacheLink(shortCode: string, url: string) {
  await redis.set(`link:${shortCode}`, url, {
    ex: 60 * 60 * 24 * 30,
  });
}

export async function getCachedLink(shortCode: string): Promise<string | null> {
  return await redis.get(`link:${shortCode}`);
}

export async function invalidateLink(shortCode: string) {
  await redis.del(`link:${shortCode}`);
}
