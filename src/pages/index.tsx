import { getFrameMetadata } from "@farcaster/core";
import Head from "next/head";

export default function Home() {
  // Frame metadata
  const frameMetadata = {
    buttons: [
      { label: "Jump!", action: "post" },
      { label: "Restart", action: "post" },
      { label: "Change Character", action: "post" },
      { label: "Change Theme", action: "post" },
    ],
    image: `${process.env.NEXT_PUBLIC_URL}/api/game-image?score=0&gameOver=false`,
    post: {
      content: "Play TestingFrame!",
    },
  };

  return (
    <>
      <Head>
        <title>TestingFrame - Farcaster Game</title>
        <meta property="og:title" content="TestingFrame" />
        <meta
          property="og:description"
          content="A Farcaster Frame Game with NFT Characters"
        />
        <meta property="og:image" content={frameMetadata.image} />
        {getFrameMetadata(frameMetadata)}
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">TestingFrame</h1>
        <p className="text-xl mb-4">
          A Farcaster Frame Game with NFT Characters
        </p>
        <div className="text-center">
          <p className="mb-2">To play:</p>
          <ol className="list-decimal list-inside text-left">
            <li>Find this frame on Farcaster</li>
            <li>Press Jump to play</li>
            <li>Mint or select your character NFT</li>
            <li>Customize your game theme</li>
          </ol>
        </div>
      </main>
    </>
  );
}
