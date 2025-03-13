import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  // Get the network name
  const network = process.env.HARDHAT_NETWORK || "hardhat";
  console.log(`Deploying to ${network}...`);

  // Deploy GameCharacterNFT
  console.log("Deploying GameCharacterNFT...");
  const GameCharacterNFT = await ethers.getContractFactory("GameCharacterNFT");
  const characterNFT = await GameCharacterNFT.deploy();
  await characterNFT.waitForDeployment();
  const characterAddress = await characterNFT.getAddress();
  console.log(`GameCharacterNFT deployed to: ${characterAddress}`);

  // Deploy GameThemeNFT
  console.log("Deploying GameThemeNFT...");
  const GameThemeNFT = await ethers.getContractFactory("GameThemeNFT");
  const themeNFT = await GameThemeNFT.deploy();
  await themeNFT.waitForDeployment();
  const themeAddress = await themeNFT.getAddress();
  console.log(`GameThemeNFT deployed to: ${themeAddress}`);

  // Only set up initial assets on testnet
  if (network === "hardhat" || network === "baseSepolia") {
    console.log("Setting up initial game assets...");

    // Add default character
    console.log("Minting default character...");
    await characterNFT.mint({ value: ethers.parseEther("0.01") });
    await characterNFT.setCharacterAttributes(
      1, // tokenId
      "Default Dino",
      15, // jumpHeight
      60, // width
      60, // height
      "/sprites/default-dino.png"
    );

    // Add default theme
    console.log("Minting default theme...");
    await themeNFT.mint({ value: ethers.parseEther("0.01") });
    await themeNFT.setThemeAttributes(
      1, // tokenId
      "Default Theme",
      "/themes/default-background.png",
      "/themes/default-obstacle.png",
      40, // obstacleWidth
      80, // obstacleHeight
      150 // obstacleGap
    );
  }

  // Update environment variables
  const envPath = path.join(__dirname, "../.env");
  let envContent = fs.readFileSync(envPath, "utf8");

  envContent = envContent.replace(
    /NEXT_PUBLIC_CHARACTER_NFT_ADDRESS=.*/,
    `NEXT_PUBLIC_CHARACTER_NFT_ADDRESS=${characterAddress}`
  );
  envContent = envContent.replace(
    /NEXT_PUBLIC_THEME_NFT_ADDRESS=.*/,
    `NEXT_PUBLIC_THEME_NFT_ADDRESS=${themeAddress}`
  );

  fs.writeFileSync(envPath, envContent);

  console.log(
    "Deployment complete! Contract addresses have been saved to .env"
  );
  console.log("Don't forget to copy these addresses to your main .env file!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
