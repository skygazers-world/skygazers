import { useCart, Item } from "react-use-cart";
import { useState, useEffect } from "react";
import { MintConfirmation } from "./MintConfirmation";
import { utils, BigNumber } from "ethers";
import { useCurveMinterIndex } from "hooks/read/useCurveMinterIndex";
import { getPrices } from "../../utils/cartUtils";

export const ShoppingCart = ({ onClose }) => {
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

    // calculate total price of all NFTs
    useEffect(() => {
        if (items && currentIndex !== null) {
            const { total, itemPrices } = getPrices(currentIndex, items.length);
            setCartTotal(total);
            setCartItemPrices(itemPrices);
            setCartItems(items);
        }
    }, [items, currentIndex]);

    useEffect(() => {
        emptyCart();
    }, [])


    const buyPopup = () => {
        SetShowBuyConfirmation(true);
    }

    if (!cartItems) return null;

    if (isLoading) return (
        <button disabled className="w-full middlerounded border-[1px] border-sgbodycopy text-sgbodycopy ">loading...</button>
    );


    return (
        <>
            <button onClick={() => { buyPopup() }} disabled={isEmpty} className="w-full px-0 middlerounded bg-white border-[1px] border-sgorange2 text-sgorange2">show cart ({totalUniqueItems})</button>
            {isEmpty ?
                null :
                <p className="w-full text-[14px] text-sgbrown font-bold mt-[10px] mb-[10px] text-center">Total: {utils.formatEther(cartTotal)} ETH</p>
            }
            {showBuyConfirmation && (<MintConfirmation onClose={() => { SetShowBuyConfirmation(false); onClose() }} />)}

        </>
    );
};