import { useEffect, useState } from "react";
import { useAccount } from 'wagmi'
import { NFTCard } from "./NFTCard";
import ChainConfig from "../../chainconfig";
import { ethers } from "ethers";
import SkyLoader from "../shared/skyloader";
import { setLogger } from "next-auth/utils/logger";
import Link from 'next/link'

const itemsPerPage = 50;

// baseOffset = what offset in our NFT collection do we start from
// totalItems = total items in this collection
export const MySkygazers = () => {

    const [myNFTs, setMyNFTs] = useState([]);
    const [connected, setConnected] = useState<boolean>(true);
    const { address: ownerAddress, isConnected } = useAccount();
    const [loadingNFTs, setLoadingNFTs] = useState(true);

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
                setLoadingNFTs(false);
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
    if(loadingNFTs) {
        return (
            <SkyLoader />

        )

    }
    if (myNFTs.length === 0) {
        return (
            <div className="w-full h-[52vh] md:h-[60vh] flex flex-col justify-center items-center md:pb-[8vh]">
                <p className="italic mb-[5px] text-opacity-50">You don't own any gazers.</p>
                {/* <Link className="font-gatwickbold underline text-sgorange2" href="/buy">buy gazers</Link> */}
            </div>
        )
    }

    return (
        <>
            <div className="
                w-full
                grid
                pl-[7.6vw]
                pr-[18.75vw]
                pt-[70px]
                sm:grid-cols-1
                md:grid-cols-2
                lg:grid-cols-4
                2xl:grid-cols-5
                gap-x-[30px]
                gap-y-[60px]
                ">
                {myNFTs.map((id) => (
                    <NFTCard id={id} />
                ))}
            </div>
        </>
    )

};