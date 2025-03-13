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

export interface GameState {
  score: number;
  gameOver: boolean;
  characterId?: string;
  themeId?: string;
}

export async function getGameState(userId: string): Promise<GameState> {
  const state = await redis.get<GameState>(`game:${userId}`);
  return state || { score: 0, gameOver: false };
}

export async function setGameState(
  userId: string,
  state: GameState
): Promise<void> {
  await redis.set(`game:${userId}`, state);
}

export async function resetGameState(userId: string): Promise<void> {
  await redis.set(`game:${userId}`, { score: 0, gameOver: false });
}
