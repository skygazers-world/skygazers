import { useCart, Item } from "react-use-cart";
import { useState, useEffect } from "react";
import { MintConfirmation } from "./MintConfirmation";
import { utils, BigNumber } from "ethers";
import { useCurveMinterIndex } from "hooks/read/useCurveMinterIndex";
import pricecurveDroids from "../../pricecurve-droids.json";

export const ShoppingCart = () => {
    const [showBuyConfirmation, SetShowBuyConfirmation] = useState<boolean>(false);
    const [cartItems, setCartItems] = useState<Item[]>();
    const [cartItemPricesViz, setCartItemPricesViz] = useState<BigNumber[]>();
    const [cartTotalViz, setCartTotalViz]= useState<BigNumber>(BigNumber.from(0));

    const {
        isEmpty,
        totalUniqueItems,
        items,
        removeItem,
        cartTotal,
        updateItem
    } = useCart();

    const { data: currentIndex } = useCurveMinterIndex();

    // useEffect(() => {
    //     currentIndex && setCurrentIndexViz(currentIndex)
    // }, [currentIndex])

    useEffect(() => {
        setCartItems(items);
    }, [items]);

    // if (!currentIndexViz) return null;


    // calculate total price of all NFTs
    useEffect(() => {
        if (items && currentIndex) {
            let total = BigNumber.from(0);
            let itemPrices : BigNumber[] = [];
            items.map((item, i) => {
                console.log(`current item ${currentIndex + i} - data point ${pricecurveDroids[currentIndex + i]}`);
                const nftPrice = BigNumber.from(pricecurveDroids[currentIndex + i]);
                console.log(`NFT price = ${typeof nftPrice}`);
                total = total.add(nftPrice);
                itemPrices.push(nftPrice);
            })
            setCartTotalViz(total);
            setCartItemPricesViz(itemPrices);
            console.log(`Itemprices`,itemPrices)
            console.log(`total`,total)
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
                {cartItems.map((item,i) => (
                    <li key={item.id}>
                        {item.name} @ {utils.formatEther(cartItemPricesViz[i])} ETH &mdash;
                        <button className="" onClick={() => removeItem(item.id)}>&times;</button>
                    </li>
                ))}
            </ul>
            <b>Total: {utils.formatEther(cartTotalViz)} ETH</b>
            <br />
            <button
                className='btn text-white bg-gradient-to-r from-pink-500 to-violet-500'
                onClick={() => { buyPopup(items) }}>
                {(totalUniqueItems === 1) ? (
                    <span>Mint this NFT</span>
                ) : (
                    <span>Mint these {totalUniqueItems} NFTs</span>
                )}
            </button>
        </div>
    );
};