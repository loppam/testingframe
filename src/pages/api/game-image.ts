import { type NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const score = searchParams.get("score") || "0";
    const gameOver = searchParams.get("gameOver") === "true";

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#1a1a1a",
            color: "white",
            fontSize: 60,
            fontWeight: "bold",
          }}
        >
          <div style={{ marginBottom: 20 }}>
            {gameOver ? "Game Over!" : "TestingFrame"}
          </div>
          <div style={{ fontSize: 40 }}>Score: {score}</div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("Error generating image:", error);
    return new Response("Error generating image", { status: 500 });
  }
}
