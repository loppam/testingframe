import { Metadata } from "next";

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

export default function Home() {
  return (
    <>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content={frameMetadata.image} />
      {frameMetadata.buttons.map((button, i) => (
        <meta
          key={i}
          property={`fc:frame:button:${i + 1}`}
          content={button.label}
        />
      ))}
      <meta
        property="fc:frame:post_url"
        content={`${process.env.NEXT_PUBLIC_URL}/api/frame`}
      />
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
