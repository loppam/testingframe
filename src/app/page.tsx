import { Metadata } from "next";
import Game from "@/components/Game";

export const metadata: Metadata = {
  title: "TestingFrame - Farcaster Game",
  description: "A Farcaster Frame Game with NFT Characters",
  openGraph: {
    title: "TestingFrame",
    description: "A Farcaster Frame Game with NFT Characters",
    images: [
      `${process.env.NEXT_PUBLIC_URL}/api/game-image?score=0&gameOver=false`,
    ],
  },
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-900">
      <div className="w-full max-w-4xl">
        <Game />
      </div>
    </main>
  );
}
