import { type NextRequest } from "next/server";
import { ImageResponse } from "next/og";

export const runtime = "edge";

const inter = fetch(
  new URL(
    "https://rsms.me/inter/font-files/Inter-Regular.woff",
    import.meta.url
  )
).then((res) => res.arrayBuffer());

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const score = searchParams.get("score") || "0";
    const gameOver = searchParams.get("gameOver") === "true";

    const interData = await inter;

    return new ImageResponse(
      (
        <div
          tw="flex flex-col items-center justify-center w-full h-full"
          style={{
            backgroundColor: "#1a1a1a",
            color: "white",
            fontSize: "60px",
            fontWeight: "bold",
            height: "100%",
            width: "100%",
          }}
        >
          <div tw="mb-8">{gameOver ? "Game Over!" : "TestingFrame"}</div>
          <div tw="text-4xl">Score: {score}</div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Inter",
            data: interData,
            style: "normal",
          },
        ],
      }
    );
  } catch (error) {
    console.error("Error generating image:", error);
    return new Response("Error generating image", { status: 500 });
  }
}
