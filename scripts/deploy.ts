import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contracts...");

  // Deploy GameCharacterNFT
  const GameCharacterNFT = await ethers.getContractFactory("GameCharacterNFT");
  const characterNFT = await GameCharacterNFT.deploy();
  await characterNFT.waitForDeployment();
  console.log(
    `GameCharacterNFT deployed to: ${await characterNFT.getAddress()}`
  );

  // Deploy GameThemeNFT
  const GameThemeNFT = await ethers.getContractFactory("GameThemeNFT");
  const themeNFT = await GameThemeNFT.deploy();
  await themeNFT.waitForDeployment();
  console.log(`GameThemeNFT deployed to: ${await themeNFT.getAddress()}`);

  // Set up some initial characters and themes
  console.log("Setting up initial game assets...");

  // Add default character
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

  console.log("Initial setup complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
