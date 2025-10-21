// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MuseedNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // Track track price and royalties
    mapping(uint256 => uint256) public trackPrice;
    mapping(uint256 => address) public trackArtist;
    mapping(uint256 => uint256) public artistEarnings;

    event TrackMinted(
        uint256 indexed tokenId,
        address indexed artist,
        uint256 price
    );
    event TrackPurchased(
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price
    );

    constructor() ERC721("Museed", "MSED") {}

    /**
     * @dev Mint a new music track NFT
     * @param to Artist's wallet address
     * @param uri IPFS metadata URI
     * @param price Price in wei
     */
    function mintTrack(
        address to,
        string memory uri,
        uint256 price
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        trackPrice[tokenId] = price;
        trackArtist[tokenId] = to;

        emit TrackMinted(tokenId, to, price);
        return tokenId;
    }

    /**
     * @dev Purchase a track (fan buys NFT)
     * Royalties: 90% to artist, 10% to platform
     */
    function purchaseTrack(uint256 tokenId) public payable {
        require(msg.value >= trackPrice[tokenId], "Insufficient payment");
        require(_ownerOf(tokenId) != msg.sender, "Already owner");

        address artist = trackArtist[tokenId];
        uint256 price = trackPrice[tokenId];

        // Calculate royalties
        uint256 artistShare = (price * 90) / 100;
        uint256 platformShare = (price * 10) / 100;

        // Update artist earnings
        artistEarnings[tokenId] += artistShare;

        // Transfer NFT to buyer
        _transfer(_ownerOf(tokenId), msg.sender, tokenId);

        // Send royalties to artist
        (bool successArtist, ) = payable(artist).call{value: artistShare}("");
        require(successArtist, "Artist payment failed");

        // Send platform fee to owner
        (bool successPlatform, ) = payable(owner()).call{value: platformShare}(
            ""
        );
        require(successPlatform, "Platform payment failed");

        // Refund excess payment
        uint256 excess = msg.value - price;
        if (excess > 0) {
            (bool successRefund, ) = payable(msg.sender).call{value: excess}(
                ""
            );
            require(successRefund, "Refund failed");
        }

        emit TrackPurchased(tokenId, msg.sender, price);
    }

    /**
     * @dev Get track details
     */
    function getTrackDetails(
        uint256 tokenId
    )
        public
        view
        returns (
            address artist,
            uint256 price,
            address currentOwner,
            string memory uri
        )
    {
        return (
            trackArtist[tokenId],
            trackPrice[tokenId],
            _ownerOf(tokenId),
            tokenURI(tokenId)
        );
    }

    // Required overrides
    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
