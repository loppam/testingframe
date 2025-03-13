import { execSync } from "child_process";
import path from "path";

async function main() {
  try {
    console.log("Starting deployment process...");

    // 1. Generate metadata
    console.log("\n1. Generating metadata...");
    execSync("npx ts-node scripts/metadata/generateMetadata.ts", {
      stdio: "inherit",
    });

    // 2. Deploy contracts
    console.log("\n2. Deploying contracts...");
    const network = process.env.HARDHAT_NETWORK || "hardhat";
    execSync(`npx hardhat run scripts/deploy.ts --network ${network}`, {
      stdio: "inherit",
    });

    // 3. Verify contracts (only on testnet/mainnet)
    if (network !== "hardhat" && network !== "localhost") {
      console.log("\n3. Verifying contracts...");
      const envPath = path.join(__dirname, "../.env");
      const env = require("dotenv").config({ path: envPath }).parsed;

      if (env.NEXT_PUBLIC_CHARACTER_NFT_ADDRESS) {
        execSync(
          `npx hardhat verify --network ${network} ${env.NEXT_PUBLIC_CHARACTER_NFT_ADDRESS}`,
          { stdio: "inherit" }
        );
      }

      if (env.NEXT_PUBLIC_THEME_NFT_ADDRESS) {
        execSync(
          `npx hardhat verify --network ${network} ${env.NEXT_PUBLIC_THEME_NFT_ADDRESS}`,
          { stdio: "inherit" }
        );
      }
    }

    console.log("\nDeployment process complete!");
  } catch (error) {
    console.error("Error during deployment:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
