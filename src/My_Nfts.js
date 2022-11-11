import { useEffect, usestate } from "react";
import axios from "axios";
import { useLocation, useParams } from 'react-router-dom';

const contractABI = require("./contract-abi.json")
const contractAddress = "0x26aF72A379e5CEa2182B7f22a19777A9Ebc59c3A"

export default function Mynft(props) {
    const [nfts, setnfts] = usestate([])
    const [loadstate, setloadstate] = usestate("notLoaded")
    useEffect(() => {
        loadNfts()
    }, [])
}

    async function loadNfts() {
    const contract = new web3.eth.Contract(contractABI, contractAddress)
    const data = await contract.fetchMyNfts()
    const addresses =  window.ethereum.request ({
        method: "eth_requestAccounts",
    });
    const address = addresses[0]
    const items = await Promise.all(data.map(async i => {
        const tokenURI = await contract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenURI)
        let item = {
            tokenId: i.tokenId.toNumber(),
            owner: i.owner,
            image: meta.data.image,
            tokenURI
        }
        return item
    }))
    setnfts(items)
    setloadstate("loaded");
    if (load === "loaded" && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>)
return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
                <p className="text-2xl font-bold text-white">{nft.name}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
)

}
