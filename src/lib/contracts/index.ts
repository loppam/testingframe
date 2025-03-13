import { ethers } from "ethers";
import { Character, Theme } from "../game/types";

// Contract ABIs will be generated and imported from here
import GameCharacterNFTAbi from "./abis/GameCharacterNFT.json";
import GameThemeNFTAbi from "./abis/GameThemeNFT.json";

export class GameContracts {
  private characterContract: ethers.Contract;
  private themeContract: ethers.Contract;

  constructor(
    provider: ethers.Provider,
    characterAddress: string,
    themeAddress: string
  ) {
    this.characterContract = new ethers.Contract(
      characterAddress,
      GameCharacterNFTAbi,
      provider
    );
    this.themeContract = new ethers.Contract(
      themeAddress,
      GameThemeNFTAbi,
      provider
    );
  }

  // Character NFT methods
  async getOwnedCharacters(address: string): Promise<Character[]> {
    const balance = await this.characterContract.balanceOf(address);
    const characters: Character[] = [];

    for (let i = 0; i < balance; i++) {
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
        jumpHeight: attrs.jumpHeight.toNumber(),
        size: {
          width: attrs.width.toNumber(),
          height: attrs.height.toNumber(),
        },
        sprite: attrs.spriteURI,
      });
    }

    return characters;
  }

  async mintCharacter(signer: ethers.Signer): Promise<void> {
    const contract = this.characterContract.connect(signer);
    const tx = await contract.mint({ value: ethers.parseEther("0.01") });
    await tx.wait();
  }

  // Theme NFT methods
  async getOwnedThemes(address: string): Promise<Theme[]> {
    const balance = await this.themeContract.balanceOf(address);
    const themes: Theme[] = [];

    for (let i = 0; i < balance; i++) {
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

  async mintTheme(signer: ethers.Signer): Promise<void> {
    const contract = this.themeContract.connect(signer);
    const tx = await contract.mint({ value: ethers.parseEther("0.01") });
    await tx.wait();
  }
}
