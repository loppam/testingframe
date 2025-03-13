// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GameCharacterNFT is ERC721, ERC721Enumerable, Ownable {
    using Strings for uint256;

    // Character attributes struct
    struct CharacterAttributes {
        string name;
        uint256 jumpHeight;
        uint256 width;
        uint256 height;
        string spriteURI;
    }

    // Mapping from token ID to character attributes
    mapping(uint256 => CharacterAttributes) private _characterAttributes;

    // Base URI for metadata
    string private _baseTokenURI;

    // Minting price
    uint256 public mintPrice = 0.01 ether;

    // Maximum supply
    uint256 public maxSupply = 1000;

    constructor() ERC721("GameCharacter", "GCHAR") Ownable(msg.sender) {}

    function mint() public payable {
        require(msg.value >= mintPrice, "Insufficient payment");
        require(totalSupply() < maxSupply, "Max supply reached");

        uint256 tokenId = totalSupply() + 1;
        _safeMint(msg.sender, tokenId);
    }

    function setCharacterAttributes(
        uint256 tokenId,
        string memory name,
        uint256 jumpHeight,
        uint256 width,
        uint256 height,
        string memory spriteURI
    ) public onlyOwner {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        
        _characterAttributes[tokenId] = CharacterAttributes({
            name: name,
            jumpHeight: jumpHeight,
            width: width,
            height: height,
            spriteURI: spriteURI
        });
    }

    function getCharacterAttributes(uint256 tokenId) public view returns (CharacterAttributes memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return _characterAttributes[tokenId];
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setMintPrice(uint256 _price) public onlyOwner {
        mintPrice = _price;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    // Required overrides
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
} 