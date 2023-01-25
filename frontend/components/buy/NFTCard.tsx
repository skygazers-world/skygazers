import { useEffect, useState } from "react";
import { useNextPrice } from '../../hooks/read/useNextPrice';
import { useTokenExists } from '../../hooks/read/useTokenExists';
import { useCart } from "react-use-cart";
import Icons from "components/shared/Icons";

import { BigNumber } from "ethers";
const getCartItemId = (id) => {
    return `${id}`;
}

export const NFTCard = (
    { id }: {
        id: string,
    }) => {

    const { addItem, inCart, items, removeItem } = useCart();
    const [nextPrice, setNextPrice] = useState<number>();
    const [isInCart, setIsInCart] = useState<boolean>(false);
    const [isAvailable, setIsAvailable] = useState<boolean>(true);
    const { data, isError: isErrorPrice, isLoading: isLoadingPrice } = useNextPrice();
    const { data: TokenExists, isError: isErrorTokenExists, isLoading: isLoadingTokenExists } = useTokenExists(BigNumber.from(id));

    useEffect(() => {
        if (data) {
            setNextPrice(data);
        }
    }, [data]);

    useEffect(() => {
        if (TokenExists) {
            console.log(`TokenExists`, TokenExists);
            setIsAvailable(false);
        }
    }, [TokenExists]);

    useEffect(() => {
        if (isErrorTokenExists) {
            console.log(`isErrorTokenExists`, isErrorTokenExists);
        }
    }, [isErrorTokenExists]);


    useEffect(() => {
        setIsInCart(inCart(getCartItemId(id)));
    }, [id, items]);

    const imageURL = "/ipfsdata/SG_placeholder.png";

    const addToCart = (id) => {
        console.log(`adding ${id}`);
        addItem({
            id: getCartItemId(id),
            name: `skygazer #${id}`,
            price: 0,
            quantity: 1
        },)
    }

    return (
        <div className="w-full font-gatwickreg text-[14px] ">
            <div className="w-full relative mb-2">
                {/* <div className="z-10 absolute z- bottom-[calc(100%-37px)] right-0 px-4 py-2 text-sgbrown font-gatwickbold bg-[rgba(0,0,0,0.05)]"> #{id}</div> */}
                <img
                    // TODO: add loading placeholder picture in /public/ipfsdata
                    src={`${imageURL}`}
                    className="w-full rounded-xl"
                    alt=""
                />
            </div>
            {(!isAvailable) ? (
                <div>Te laat !</div>
            ) : (
                <div className="w-full flex flex-row items-center justify-center min-h-[45px] text-sgbodycopy">
                    <div className="text-sgbodycopy text-[12px]"> #{id}</div>
                    <div className="flex-1"></div>
                    {(isInCart) ? (
                        <div className="flex flex-row items-center justify-center cursor-pointer" onClick={() => { removeItem(getCartItemId(id)) }}>
                            <div className="text-sgbrown mr-5 text-center">
                                <p className="underline">remove</p>
                            </div>
                            <p className="mr-2">in cart</p>
                            <Icons.Vmark width="14px" fill="#59342B" />


                        </div>
                    ) : (
                        <>
                            {(isInCart) ? (
                                <p>TODO: NFT is already in Cart</p>
                            ) : (
                                <>
                                    {(isLoadingPrice) ? (
                                        <p>TODO: NFT Price loading</p>
                                    ) : (
                                        <button
                                            className=' py-3 px-5 rounded-[22.5px] text-sgbodycopy bg-sgyellow font-gatwickbold text-[14px]'
                                            onClick={() => addToCart(id)}>
                                            + add to cart
                                            {/* + add to cart ({nextPrice} ETH) */}
                                        </button>
                                    )}


                                </>
                            )}
                        </>
                    )}

                </div>
            )}

        </div>
    )
};

