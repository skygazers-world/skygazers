import { useEffect, useState } from "react";
import { useAccount } from 'wagmi'
import { utils, ethers } from "ethers";
import { useRouter } from 'next/router';
// import NFTCard from "./NFTCard";

import { CartProvider, useCart } from "react-use-cart";

// import { useNextPrice } from '../../hooks/read/useNextPrice';
// import { useNftBalance } from '../../hooks/read/useNftBalance';

export const Cart = () => {

    const {
        isEmpty,
        totalUniqueItems,
        items,
        updateItemQuantity,
        removeItem,
        cartTotal
    } = useCart();

    // const { address: ownerAddress } = useAccount();
    // const [ownerBalanceViz, setOwnerBalanceViz] = useState();
    // const [nextPriceViz, setNextPriceViz] = useState();
    // const { data: nextPrice } = useNextPrice();
    // const { data: ownerBalance } = useNftBalance({ ownerAddress });

    // useEffect(() => {
    //     setNextPriceViz(nextPrice);
    // }, [nextPrice]);


    // useEffect(() => {
    //     setOwnerBalanceViz(utils.formatUnits(ownerBalance, "wei"));
    // }, [ownerBalance]);


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

    const buyPopup = () => {

    }


    if (isEmpty) return <p>Your cart is empty</p>;

    return (
        <>
            <h1>Cart ({totalUniqueItems})</h1>
            <br />
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        {item.name} &mdash;
                        {/* <button
                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
              >
                -
              </button>
              <button
                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
              >
                +
              </button> */}
                        <button onClick={() => removeItem(item.id)}>&times;</button>
                    </li>
                ))}
            </ul>
            <b>Total: {cartTotal} ETH</b>
            <br />
            <button
                className='btn text-white bg-gradient-to-r from-pink-500 to-violet-500'
                onClick={() => buyPopup(id)}>
                {(totalUniqueItems === 1) ? (
                    <span>Mint this NFT</span>
                ) : (
                    <span>Mint these {totalUniqueItems} NFTs</span>
                )}
            </button>
        </>
    );
};