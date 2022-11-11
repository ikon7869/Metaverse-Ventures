//SPDX-License-Identifier:MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error NotOwner();
pragma solidity ^0.8.16;

contract metaventures is ERC721URIStorage,Ownable{
    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;

    struct NftItems {
        uint256 tokenId;
        address owner;
    }

    mapping (uint256 => NftItems) nftItemsId;

    constructor () ERC721("MetaVen","MTV"){
    }

    function mintNft(string memory tokenURI) public returns(uint256) {
        tokenIds.increment();
        uint256 tokenId = tokenIds.current();
        _safeMint(msg.sender,tokenId);
        _setTokenURI(tokenId,tokenURI);
        nftItemsId[tokenId] = NftItems (
            tokenId,
            msg.sender);
        return tokenId;
    }

    function transferNft(address _to, uint256 _tokenId) public {
        if (nftItemsId[_tokenId].owner != msg.sender) {
                revert NotOwner();
        }
        safeTransferFrom(nftItemsId[_tokenId].owner, _to,_tokenId);
        nftItemsId[_tokenId].owner = msg.sender;
    }

    function fetchMyNfts() public view returns(NftItems[] memory) {
        uint256 itemCount = tokenIds.current();
        uint256 currentIndex = 0;

        NftItems[] memory items = new NftItems[](itemCount);
        for (uint256 i = 0; i < itemCount; i++ ){
            if(nftItemsId[i+1].owner == msg.sender){
                uint256 currentId = i + 1;
                NftItems storage currentItem = nftItemsId[currentId];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return items;
    }
}