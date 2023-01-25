import { useEffect, useState } from "react";
import { useAccount } from 'wagmi'
import { NFTCard } from "./NFTCard";
import ChainConfig from "../../chainconfig.json";
import { ethers } from "ethers";
import Link from 'next/link';
import { setLogger } from "next-auth/utils/logger";

const itemsPerPage = 50;

// baseOffset = what offset in our NFT collection do we start from
// totalItems = total items in this collection
export const MySkygazers = () => {

    const [myNFTs, setMyNFTs] = useState([]);
    const [connected, setConnected] = useState<boolean>(true);
    const { address: ownerAddress, isConnected } = useAccount();

    let provider;
    let signer;
    let SkyGazersContract;

    useEffect(() => {
        const { ethereum } = window;
        if (ethereum) {
            provider = new ethers.providers.Web3Provider(ethereum as any);
            signer = provider.getSigner();

            SkyGazersContract = new ethers.Contract(
                ChainConfig.skygazers.address,
                ChainConfig.skygazers.abi,
                signer
            );
        }
    });


    const getNFTsFor = async (ownerAddress) => {
        let nfts = [];
        let ownerBalance = await SkyGazersContract.balanceOf(ownerAddress);
        for (var i = 0; i < ownerBalance.toNumber(); i++) {
            let nftId = await SkyGazersContract.tokenOfOwnerByIndex(ownerAddress, i);
            nfts.push(nftId.toNumber());
        }
        nfts.sort((a, b) => a - b)
        return nfts;
    }


    useEffect(() => {
        if (ownerAddress && SkyGazersContract) {
            // Load my NFTs
            getNFTsFor(ownerAddress).then((nfts) => {
                setMyNFTs(nfts);
            });
        }
    }, [ownerAddress, SkyGazersContract]);


    useEffect(() => {
        setConnected(isConnected);
    }, [isConnected]);

    if (!connected) {
        return null;
    }


    // if (!isConnected) {
    //     return (
    //         <div className="">
    //             <p>
    //                 You need to be connected to your wallet to see your collection
    //             </p>
    //             <p>Look in the right top corner - yeah there suske..</p>
    //         </div>
    //     )
    // }

    if (myNFTs.length === 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                You don't have any Skygazer NFTs yet. <br />
                <a
                    className='btn text-white bg-gradient-to-r from-pink-500 to-violet-500'
                    href="/mint">Buy one now</a>
            </div>

        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {myNFTs.map((id) => (
                    <div key={id}>
                        <NFTCard id={id} />
                        <Link className='btn text-white bg-gradient-to-r from-pink-500 to-violet-500' href={`/skygazer/${id}`}>Edit</Link>
                    </div>
                ))}
            </div>
        </>
    )

};