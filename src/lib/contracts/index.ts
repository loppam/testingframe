import { ethers, Provider, Signer } from "ethers";
import { Character, Theme } from "../game/types";
import { GameCharacterNFT, GameThemeNFT } from "../../typechain-types";

// Contract ABIs will be generated and imported from here
import GameCharacterNFTArtifact from "./abis/GameCharacterNFT.json";
import GameThemeNFTArtifact from "./abis/GameThemeNFT.json";

export class GameContracts {
  private characterContract: GameCharacterNFT;
  private themeContract: GameThemeNFT;

  constructor(
    provider: Provider,
    characterAddress: string,
    themeAddress: string
  ) {
    this.characterContract = new ethers.Contract(
      characterAddress,
      GameCharacterNFTArtifact.abi,
      provider
    ) as unknown as GameCharacterNFT;

    this.themeContract = new ethers.Contract(
      themeAddress,
      GameThemeNFTArtifact.abi,
      provider
    ) as unknown as GameThemeNFT;
  }

  // Character NFT methods
  async getOwnedCharacters(address: string): Promise<Character[]> {
    const balance = await this.characterContract.balanceOf(address);
    const characters: Character[] = [];

    for (let i = 0; i < Number(balance); i++) {
      const tokenId = await this.characterContract.tokenOfOwnerByIndex(
        address,
        i
      );
      const attrs = await this.characterContract.getCharacterAttributes(
        tokenId
      );

      characters.push({
        id: i,
        tokenId: tokenId.toString(),
        name: attrs.name,
        jumpHeight: Number(attrs.jumpHeight),
        size: {
          width: Number(attrs.width),
          height: Number(attrs.height),
        },
        sprite: attrs.spriteURI,
      });
    }

    return characters;
  }

  async mintCharacter(signer: Signer): Promise<void> {
    const contract = this.characterContract.connect(signer) as GameCharacterNFT;
    const tx = await contract.mint({ value: ethers.parseEther("0.01") });
    await tx.wait();
  }

  // Theme NFT methods
  async getOwnedThemes(address: string): Promise<Theme[]> {
    const balance = await this.themeContract.balanceOf(address);
    const themes: Theme[] = [];

    for (let i = 0; i < Number(balance); i++) {
      const tokenId = await this.themeContract.tokenOfOwnerByIndex(address, i);
      const attrs = await this.themeContract.getThemeAttributes(tokenId);

      themes.push({
        id: i,
        tokenId: tokenId.toString(),
        name: attrs.name,
        background: attrs.backgroundURI,
        obstacleSprite: attrs.obstacleURI,
        groundSprite: attrs.groundURI,
        colorScheme: {
          primary: attrs.colorScheme.primary,
          secondary: attrs.colorScheme.secondary,
          accent: attrs.colorScheme.accent,
        },
      });
    }

    return themes;
  }

  async mintTheme(signer: Signer): Promise<void> {
    const contract = this.themeContract.connect(signer) as GameThemeNFT;
    const tx = await contract.mint({ value: ethers.parseEther("0.01") });
    await tx.wait();
  }
}
