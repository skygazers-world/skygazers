import { useCart, Item } from "react-use-cart";
import { useState, useEffect } from "react";
import { MintConfirmation } from "./MintConfirmation";
import { utils, BigNumber } from "ethers";
import { useCurveMinterIndex } from "hooks/read/useCurveMinterIndex";
import { getPrices } from "../../utils/cartUtils";

export const ShoppingCart = () => {
    const [showBuyConfirmation, SetShowBuyConfirmation] = useState<boolean>(false);
    const [cartItems, setCartItems] = useState<Item[]>();
    const [cartItemPrices, setCartItemPrices] = useState<BigNumber[]>();
    const [cartTotal, setCartTotal] = useState<BigNumber>(BigNumber.from(0));

    const {
        isEmpty,
        totalUniqueItems,
        items,
        removeItem,
        emptyCart,
    } = useCart();

    const { data: currentIndex, isLoading } = useCurveMinterIndex();

    console.log("isLoading ==>",isLoading);

    // calculate total price of all NFTs
    useEffect(() => {
        if (items && currentIndex) {
            const { total, itemPrices } = getPrices(currentIndex, items.length);
            setCartTotal(total);
            setCartItemPrices(itemPrices);
            setCartItems(items);
        }
    }, [items, currentIndex]);

    useEffect(()=>{
        emptyCart();
    },[])


    const buyPopup = () => {
        SetShowBuyConfirmation(true);
    }

    if (!cartItems) return null;

    if (isLoading) return (
    <button disabled className="middlerounded border-[1px] border-sgbodycopy text-sgbodycopy ">loading cart...</button>
    );


    return (
        <>

        {/* <div className="">
            <div>Cart ({totalUniqueItems})</div>
            <br />
            <ul>
                {cartItems.map((item, i) => (
                    <li key={item.id}>
                        {item.name} @ {utils.formatEther(cartItemPrices[i])} ETH &mdash;
                        <button className="" onClick={() => removeItem(item.id)}>&times;</button>
                    </li>
                ))}
            </ul>
            <b>Total: {utils.formatEther(cartTotal)} ETH</b>
            <br />
            <button
                className='btn text-white bg-gradient-to-r from-pink-500 to-violet-500'
                onClick={() => { buyPopup() }}>
                {(totalUniqueItems === 1) ? (
                    <span>Mint this NFT</span>
                ) : (
                    <span>Mint these {totalUniqueItems} NFTs</span>
                )}
            </button>

            {showBuyConfirmation && (<MintConfirmation onClose={() => { SetShowBuyConfirmation(false) }} />)}
        </div> */}
        <button disabled={isEmpty} className="w-full px-0 middlerounded bg-white border-[1px] border-sgbodycopy text-sgbodycopy">show cart ({totalUniqueItems})</button>
        {isEmpty?
            null:
            <p className="w-full text-[14px] text-sgbrown font-bold mt-[10px] mb-[10px] text-center">Total: {utils.formatEther(cartTotal)} ETH</p>
        }

        </>
    );
};