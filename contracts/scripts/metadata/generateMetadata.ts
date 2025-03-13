import fs from "fs";
import path from "path";

interface CharacterMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
}

interface ThemeMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
}

const BASE_IMAGE_URI = "https://testingframe-iota.vercel.app";

function generateCharacterMetadata(
  tokenId: number,
  name: string,
  jumpHeight: number,
  width: number,
  height: number,
  spriteURI: string
): CharacterMetadata {
  return {
    name,
    description: `A unique character for the TestingFrame game with ID ${tokenId}`,
    image: `${BASE_IMAGE_URI}${spriteURI}`,
    attributes: [
      {
        trait_type: "Jump Height",
        value: jumpHeight,
      },
      {
        trait_type: "Width",
        value: width,
      },
      {
        trait_type: "Height",
        value: height,
      },
    ],
  };
}

function generateThemeMetadata(
  tokenId: number,
  name: string,
  backgroundURI: string,
  obstacleURI: string,
  obstacleWidth: number,
  obstacleHeight: number,
  obstacleGap: number
): ThemeMetadata {
  return {
    name,
    description: `A unique theme for the TestingFrame game with ID ${tokenId}`,
    image: `${BASE_IMAGE_URI}${backgroundURI}`,
    attributes: [
      {
        trait_type: "Obstacle Width",
        value: obstacleWidth,
      },
      {
        trait_type: "Obstacle Height",
        value: obstacleHeight,
      },
      {
        trait_type: "Obstacle Gap",
        value: obstacleGap,
      },
      {
        trait_type: "Obstacle Image",
        value: `${BASE_IMAGE_URI}${obstacleURI}`,
      },
    ],
  };
}

async function main() {
  const metadataDir = path.join(__dirname, "../../public/metadata");
  const characterDir = path.join(metadataDir, "characters");
  const themeDir = path.join(metadataDir, "themes");

  // Create directories if they don't exist
  fs.mkdirSync(characterDir, { recursive: true });
  fs.mkdirSync(themeDir, { recursive: true });

  // Generate default character metadata
  const defaultCharacter = generateCharacterMetadata(
    1,
    "Default Dino",
    15,
    60,
    60,
    "/sprites/default-dino.png"
  );

  fs.writeFileSync(
    path.join(characterDir, "1.json"),
    JSON.stringify(defaultCharacter, null, 2)
  );

  // Generate default theme metadata
  const defaultTheme = generateThemeMetadata(
    1,
    "Default Theme",
    "/themes/default-background.png",
    "/themes/default-obstacle.png",
    40,
    80,
    150
  );

  fs.writeFileSync(
    path.join(themeDir, "1.json"),
    JSON.stringify(defaultTheme, null, 2)
  );

  console.log("Metadata generation complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
