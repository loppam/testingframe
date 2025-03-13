import { type NextRequest } from "next/server";
import { getFrameMessage, FrameRequest } from "@farcaster/core";
import { redis } from "~/lib/redis";

// Game state interface
interface GameState {
  score: number;
  isGameOver: boolean;
  characterId?: number;
  themeId?: number;
}

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  try {
    // Validate frame request
    const body: FrameRequest = await req.json();
    const frameMessage = await getFrameMessage(body);

    if (!frameMessage) {
      return new Response("Invalid frame message", { status: 400 });
    }

    const { fid, buttonIndex } = frameMessage;

    // Get or initialize game state
    let gameState: GameState = (await redis.get(`game:${fid}`)) || {
      score: 0,
      isGameOver: false,
    };

    // Handle different button actions
    switch (buttonIndex) {
      case 1: // Jump
        if (!gameState.isGameOver) {
          gameState.score += 1;
        }
        break;
      case 2: // Restart
        gameState = {
          score: 0,
          isGameOver: false,
          characterId: gameState.characterId,
          themeId: gameState.themeId,
        };
        break;
      case 3: // Select Character (if implemented)
        // TODO: Implement character selection
        break;
      case 4: // Select Theme (if implemented)
        // TODO: Implement theme selection
        break;
    }

    // Save updated game state
    await redis.set(`game:${fid}`, gameState);

    // Generate frame response
    return new Response(
      JSON.stringify({
        frames: [
          {
            image: `${process.env.NEXT_PUBLIC_URL}/api/game-image?score=${gameState.score}&gameOver=${gameState.isGameOver}`,
            buttons: [
              { label: "Jump!", action: "post" },
              { label: "Restart", action: "post" },
              { label: "Change Character", action: "post" },
              { label: "Change Theme", action: "post" },
            ],
            post: {
              content: `Playing TestingFrame! Score: ${gameState.score}`,
            },
          },
        ],
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Frame error:", error);
    return new Response("Error processing frame", { status: 500 });
  }
}
