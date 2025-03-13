import { expect } from "chai";
import { ethers } from "hardhat";
import { GameCharacterNFT, GameThemeNFT } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Game NFTs", function () {
  let characterNFT: GameCharacterNFT;
  let themeNFT: GameThemeNFT;
  let owner: HardhatEthersSigner;
  let player: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, player] = await ethers.getSigners();

    // Deploy contracts
    const GameCharacterNFT = await ethers.getContractFactory(
      "GameCharacterNFT"
    );
    characterNFT = await GameCharacterNFT.deploy();

    const GameThemeNFT = await ethers.getContractFactory("GameThemeNFT");
    themeNFT = await GameThemeNFT.deploy();
  });

  describe("GameCharacterNFT", function () {
    it("Should allow minting with correct payment", async function () {
      await expect(
        characterNFT.connect(player).mint({
          value: ethers.parseEther("0.01"),
        })
      ).to.not.be.reverted;

      expect(await characterNFT.balanceOf(player.address)).to.equal(1);
    });

    it("Should not allow minting with insufficient payment", async function () {
      await expect(
        characterNFT.connect(player).mint({
          value: ethers.parseEther("0.005"),
        })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should set and get character attributes correctly", async function () {
      await characterNFT.connect(player).mint({
        value: ethers.parseEther("0.01"),
      });

      await characterNFT
        .connect(owner)
        .setCharacterAttributes(1, "Test Dino", 10, 50, 50, "test-sprite.png");

      const attrs = await characterNFT.getCharacterAttributes(1);
      expect(attrs.name).to.equal("Test Dino");
      expect(attrs.jumpHeight).to.equal(10);
      expect(attrs.width).to.equal(50);
      expect(attrs.height).to.equal(50);
      expect(attrs.spriteURI).to.equal("test-sprite.png");
    });
  });

  describe("GameThemeNFT", function () {
    it("Should allow minting with correct payment", async function () {
      await expect(
        themeNFT.connect(player).mint({
          value: ethers.parseEther("0.01"),
        })
      ).to.not.be.reverted;

      expect(await themeNFT.balanceOf(player.address)).to.equal(1);
    });

    it("Should not allow minting with insufficient payment", async function () {
      await expect(
        themeNFT.connect(player).mint({
          value: ethers.parseEther("0.005"),
        })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should set and get theme attributes correctly", async function () {
      await themeNFT.connect(player).mint({
        value: ethers.parseEther("0.01"),
      });

      await themeNFT
        .connect(owner)
        .setThemeAttributes(
          1,
          "Test Theme",
          "bg.png",
          "obstacle.png",
          40,
          80,
          150
        );

      const attrs = await themeNFT.getThemeAttributes(1);
      expect(attrs.name).to.equal("Test Theme");
      expect(attrs.backgroundURI).to.equal("bg.png");
      expect(attrs.obstacleURI).to.equal("obstacle.png");
      expect(attrs.obstacleWidth).to.equal(40);
      expect(attrs.obstacleHeight).to.equal(80);
      expect(attrs.obstacleGap).to.equal(150);
    });
  });
});
