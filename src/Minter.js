import { useEffect, useState } from "react";
import {walletButton, getWalletConnect, mintNFT} from "./WalletButton";
import {BrowserRouter as Router,Switch,Route,Link,useRouteMatch,useParams} from "react-router-dom";
import {Mynft} from "./My_Nfts"

const Minter = (props) => {
  const [walletAddress, setWallet] = useState("");
  const [name, setName] = useState("");
  const [to, setTo] = useState("")
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");
  const [status, setStatus] = useState("");
  useEffect(async () => {
    const {address,status} = await getWalletConnect();
    setWallet(address);
    setStatus(status);
    addWalletListener();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
        } else {
          setWallet("");
          setStatus("Connect your wallet !")
        }
      });
    } else {
      setStatus(
        <p>
          Please Install Metamask !!
        </p>
      );
    }
  }

  const connectWalletPressed = async () => { 
    const walletResponse = await walletButton();
    setWallet(walletResponse.address);
    setStatus(status);
   
  };

  const onMintPressed = async () => {
    const {status} = await mintNFT(url,to,name,description);
    setStatus(status);
  };

  const myNft = async () => {
    await Mynft();
  }

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
          <button onClick={myNft}>MY NFTs</button>
      <br></br>
      <h1 id="title">Metaverse Ventures NFT Minter</h1>
      <form>
        <h2>Link </h2>
        <input
          type="text"
          onChange={(event) => setURL(event.target.value)}
        />
        <h2>Address (To)</h2>
        <input type="text" />
        <h2>Name </h2>
        <input
          type="text"
          onChange={(event) => setName(event.target.value)}
        />
        <h2>Description </h2>
        <input
          type="text"
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
    </div>
  );
};

export default Minter;
