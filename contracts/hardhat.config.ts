import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import "./scripts/deploy"; // Import the deploy task

dotenv.config();

// Add a task to copy artifacts to the Next.js app
const nextArtifactsPath = "../src/lib/contracts/abis";

// Ensure the Next.js artifacts directory exists
if (!fs.existsSync(path.join(__dirname, nextArtifactsPath))) {
  fs.mkdirSync(path.join(__dirname, nextArtifactsPath), { recursive: true });
}

// Add a task to copy and flatten ABI files
task("copy-abis", "Copies ABI files to the Next.js app").setAction(
  async (_, { artifacts }) => {
    const contracts = {
      GameCharacterNFT:
        "contracts/contracts/GameCharacterNFT.sol:GameCharacterNFT",
      GameThemeNFT: "contracts/contracts/GameThemeNFT.sol:GameThemeNFT",
    };

    for (const [name, fullPath] of Object.entries(contracts)) {
      const artifact = await artifacts.readArtifact(fullPath);
      fs.writeFileSync(
        path.join(__dirname, nextArtifactsPath, `${name}.json`),
        JSON.stringify(artifact.abi, null, 2)
      );
      console.log(`Copied ${name} ABI to ${nextArtifactsPath}`);
    }
  }
);

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    "base-sepolia": {
      url: process.env.BASE_SEPOLIA_RPC || "https://sepolia.base.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 84532,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts", // Store artifacts in local directory first
  },
};

export default config;
