import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// Add a task to copy artifacts to the Next.js app
const nextArtifactsPath = "../src/lib/contracts/abis";

// Ensure the Next.js artifacts directory exists
if (!fs.existsSync(path.join(__dirname, nextArtifactsPath))) {
  fs.mkdirSync(path.join(__dirname, nextArtifactsPath), { recursive: true });
}

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
    artifacts: path.join(__dirname, nextArtifactsPath),
  },
};

export default config;
