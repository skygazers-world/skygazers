import { useCart, Item } from "react-use-cart";
import { useState, useEffect } from "react";
import { MintConfirmation } from "./MintConfirmation";
import { utils, ethers, BigNumber } from "ethers";
import { useCurveMinterIndex } from "hooks/read/useCurveMinterIndex";
import pricecurveDroids from "../../pricecurve-droids.json";
import { setUncaughtExceptionCaptureCallback } from "process";

export const ShoppingCart = () => {

    const [currentIndexViz, setCurrentIndexViz]: [number, any] = useState();

    const [showBuyConfirmation, SetShowBuyConfirmation] = useState(false);
    const [cartItems, setCartItems]: [Item[], any] = useState();
    const [cartTotalViz, setCartTotalViz]: [BigNumber, any] = useState(BigNumber.from(0));

    const {
        isEmpty,
        totalUniqueItems,
        items,
        removeItem,
        cartTotal
    } = useCart();

    const { data: currentIndex } = useCurveMinterIndex();

    // useEffect(() => {
    //     currentIndex && setCurrentIndexViz(currentIndex.toNumber())
    // }, [currentIndex])

    // useEffect(() => {
    //     setCartItems(items);
    // }, [items]);

    // if (!currentIndexViz) return null;


    // calculate total price of all NFTs
    useEffect(() => {
        if (items && currentIndex) {
            setCartItems(items);
            const total = BigNumber.from(0);
            items.map((item, i) => {
                console.log(`current item ${currentIndex.toNumber() + i}`);
                const nftPrice = Object.assign(BigNumber.from(0),pricecurveDroids[currentIndex.toNumber() + i]);
                // console.log(pricecurveDroids[currentIndex.toNumber() + i]);
                // total.add(BigNumber.from(pricecurveDroids[currentIndex.toNumber()+i]));
            })
            setCartTotalViz(total);
            console.log(`price=${nftPrice} ${JSON.stringify(nftprice)}`);
        }
    }, [items, currentIndex]);

    const buyPopup = (items) => {
        SetShowBuyConfirmation(true);
    }
    if (!cartItems) return null;

    if (isEmpty) return <p>Your cart is empty</p>;

    if (showBuyConfirmation) {
        return (<MintConfirmation />)
    }

    return (
        <div>
            <div>Cart ({totalUniqueItems})</div>
            <br />
            <ul>
                {cartItems.map((item) => (
                    <li key={item.id}>
                        {item.name} &mdash;
                        <button onClick={() => removeItem(item.id)}>&times;</button>
                    </li>
                ))}
            </ul>
            <b>Total: {cartTotalViz.toString()} ETH</b>
            <br />
            <button
                className='btn text-white bg-gradient-to-r from-pink-500 to-violet-500'
                onClick={() => { buyPopup(cartItems) }}>
                {(totalUniqueItems === 1) ? (
                    <span>Mint this NFT</span>
                ) : (
                    <span>Mint these {totalUniqueItems} NFTs</span>
                )}
            </button>
        </div>
    );
};