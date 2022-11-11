import { pinJSONToIPFS } from './utils/pinata';

require('dotenv').config();
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3("https://eth-goerli.g.alchemy.com/v2/pBshSjAearI4_vYoowwn-2znRosg6WDR");
const contractABI = require("./contract-abi.json")
const contractAddress = "0x26aF72A379e5CEa2182B7f22a19777A9Ebc59c3A"

export const walletButton = async () => {
    if (window.ethereum) {
        try {
            const addresses = await window.ethereum.request ({
                method: "eth_requestAccounts",
            });

            const object = {
                address: addresses[0],
                status: "Text",
            }
            return object;
        } catch (error) {
            return {
                address: "",
                status: error.message,
            };
        }
    } else {
        return{
            status: (
              <span>
                <p>
                Please install Metamask !
                </p>
              </span>
            ),
          };
        }
    }


export const getWalletConnect = async () => {
    if (window.ethereum) {
        try {
            const addressArr = await window.etheruem.request({
                method: "eth_accounts",
            });
            if (addressArr.length > 0) {
                return {
                    address: addressArr[0],
                };
            }else {
                return {
                    address: "",
                    status: "Connect your wallet !",
                };
            }
        } catch (error) {
            return {
                address: "",
                status: error,
            };
        }
    } else {
        return{
            status: (
              <span>
                <p>
                Please install Metamask !
                </p>
              </span>
            ),
          };
        }
}
   export const mintNFT = async(url, to, name, description) => {
        if (url.trim() == "" ||(to.trim() == "") || (name.trim() == "" || description.trim() == "")) {
            return {
                success: false,
                status: "Please fill all the details",
            }
        }

        const metadata = new Object() ;
        metadata.name = name;
        metadata.image = url;
        metadata.description = description;
        metadata.to = to;

        const pinataResponse = await pinJSONToIPFS(metadata);
        if (!pinataResponse.success) {
            return {
                success: false,
                status: "Something went wrong!",
            }
        }

        const tokenURI = pinataResponse.pinataUrl;

        window.ethereum = await new web3.eth.Contract(contractABI, contractAddress);

        const transactionParameters = {
            to: to,
            from: window.ethereum.selectedAddress,
            'data': window.contract.methods.mintNft(to,tokenURI).encodeABI()
        };

        try {
            const txHash = await window.ethereum.request({
                methods: "eth_sendTransaction",
                params: [transactionParameters],
            });
            return{
                success: true,
                status: "transaction on Etherscan: https://goerli.etherscan.io/tx/" + txHash
            }
        } catch (error) {
            return {
                success: false,
                status: "Something went wrong!"
            }
        }
    }
