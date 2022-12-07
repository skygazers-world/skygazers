import { useEffect, useState } from "react";
import { useAccount } from 'wagmi'
import { utils, ethers } from "ethers";
import { useRouter } from 'next/router';
import { NFTCard } from "./NFTCard";
import { Cart } from "./Cart";
import ReactPaginate from 'react-paginate';

import { useNextPrice } from '../../hooks/read/useNextPrice';
import { useNftBalance } from '../../hooks/read/useNftBalance';

const itemsPerPage = 50;

// baseOffset = what offset in our NFT collection do we start from
// totalItems = total items in this collection
export const Gallery = ({baseOffset,totalItems}) => {

    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    // Simulate fetching items from another resources.
    // (This could be items from props; or items loaded in a local state
    // from an API endpoint with useEffect and useState)
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);

    let nfts = [];
    for (let i = baseOffset + itemOffset; i < baseOffset + endOffset; i++) {
        nfts.push(i);
    }

    //   const currentItems = items.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(totalItems / itemsPerPage);


    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % totalItems;
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        setItemOffset(newOffset);
    };

    const { address: ownerAddress } = useAccount();
    const [ownerBalanceViz, setOwnerBalanceViz] = useState();
    const [nextPriceViz, setNextPriceViz] = useState();
    const { data: nextPrice } = useNextPrice();
    const { data: ownerBalance } = useNftBalance({ ownerAddress });

    useEffect(() => {
        setNextPriceViz(nextPrice);
    }, [nextPrice]);


    useEffect(() => {
        setOwnerBalanceViz(utils.formatUnits(ownerBalance, "wei"));
    }, [ownerBalance]);


    // const getUserNft = async () => {
    //     let userNftIDs = await getUserNftIds()
    //     setUserNFTs(userNftIDs)
    // }

    // const getUserNftIds = async () => {
    //     let userNFTsByIDArray: number[] = []

    //     const { ethereum } = window;
    //     if (ethereum) {
    //         let totalSupply = await FrensPoolContract.totalSupply()

    //         for (var i = 1; i <= totalSupply.toNumber(); i++) {
    //             let nftOwner = await FrensPoolContract.ownerOf(i);
    //             if(nftOwner === accountAddress) {
    //                 userNFTsByIDArray.push(i)
    //             }
    //         }
    //     }
    //     return userNFTsByIDArray
    // }

    // const setUserNFTs = async (userNftIDs: number[]) => {
    //     let userWalletNFTs: any[] = []

    //     const { ethereum } = window;
    //     if (ethereum) {
    //         for (var nftID of userNftIDs) {
    //             let tokenURI = await FrensPoolContract.tokenURI(nftID);
    //             const json = atob(tokenURI.substring(29));
    //             const nftMetaData = JSON.parse(json);
    //             userWalletNFTs.push(nftMetaData)
    //         }
    //         setWalletNFTs(userWalletNFTs)  
    //         console.log('userWalletNFTs', userWalletNFTs)
    //     }
    // }

    // console.log(walletNFTs)



    // if(walletNFTs.length === 0) {
    //     return <div className="flex flex-col items-center justify-center">
    //         <div className="">None 🧐</div>
    //     </div>
    // }





    return (
        <>
            <Cart />
            You have {ownerBalanceViz} items.
            Next price: {nextPriceViz} ETH
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {nfts.map((id) => (
                    <div key={id}>
                        <NFTCard id={id} />
                    </div>
                ))}
                <br />
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                />
            </div>
        </>
    )

};