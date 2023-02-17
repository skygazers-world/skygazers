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
        if (isLoadingTokenExists) {
            console.log(`isLoadingTokenExists`, isLoadingTokenExists);
        }
    }, [isLoadingTokenExists]);

    useEffect(() => {
        setIsInCart(inCart(getCartItemId(id)));
    }, [id, items]);

    const imageURL = `${process.env.NEXT_PUBLIC_IPFS_ROOT}${id}_660.jpeg`;

    const addToCart = (id) => {
        console.log(`adding ${id}`);
        addItem({
            id: getCartItemId(id),
            name: `#${id}`,
            price: 0,
            quantity: 1,
            image: imageURL
        },)
    }

    return (
        <div className="w-full font-gatwickreg text-[14px] ">
            {isAvailable?
            <div onClick={isInCart?() => { removeItem(getCartItemId(id)) }:() => addToCart(id)} className="w-full relative mb-2 opacity-100 bg-[#F7F5F4] cursor-pointer transition-all lg:hover:scale-[1.02] ">
                <div className={isInCart?"z-10 absolute bottom-0 right-0 px-3 py-3 bg-transparent opacity-100":"z-10 absolute bottom-0 right-0 px-3 py-3 bg-transparent opacity-50"}>
                    <div className="bg-[rgba(255,255,255,0.95)] shadow-sm w-[36px] h-[36px] rounded-[20px] flex flex-col justify-center items-center">
                        <Icons.Vmark width="45%" fill="#FF5C00" />
                    </div>
                </div>
                <img
                    src={`${imageURL}`}
                    className="w-full rounded-xl"
                    alt=""
                />
            </div>
            :
            <div className="w-full  ease-in-out relative mb-2 opacity-80 transition-all lg:hover:scale-[1.02] bg-[#F7F5F4] ">
                <div className="flex flex-col justify-end items-center z-10 absolute top right-0 px-2 pb-12 bg-transparent w-full h-full">
                    <div className="bg-[rgba(255,255,255,0.2)] w-[40px] h-[40px] rounded-[20px] flex flex-col justify-center items-center">
                        <Icons.Lockicon width="100%" />
                    </div>
                </div>
                <img
                    src={`${imageURL}`}
                    className="w-full rounded-xl"
                    alt=""
                />
            </div>

            }
            <div className="w-full flex flex-row items-center justify-center min-h-[45px] text-sgbodycopy">
                <div className={isAvailable?"text-sgbodycopy text-[12px] font-gatwickbold":"text-sgbodycopy text-[12px] font-gatwickreg"}> #{id}</div>
                <div className="flex-1"></div>
                {isLoadingTokenExists?
                    <div className="w-[120px] h-[18px] bg-[#F7F5F4] rounded-[9px]">
                    </div>
                    :
                    <>
                        {(!isAvailable) ? (
                            <p className="font-gatwickreg text-sgbodycopy text-opacity-50">gazer sold</p>
                        ) : (
                            <>

                                {(isInCart) ? (
                                    <div className="flex flex-row items-center justify-center cursor-pointer" onClick={() => { removeItem(getCartItemId(id)) }}>
                                        <div className="text-sgbrown text-right">
                                            <p className="underline font-gatwickreg">remove from cart</p>
                                        </div>
                                        {/* <p className="mr-2">in cart</p>
                                        <Icons.Vmark width="14px" fill="#59342B" /> */}
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            className='smallyellowpillbtn bg-transparent border-[1px] border-sgbodycopy'
                                            onClick={() => addToCart(id)}>
                                            + add to cart
                                            {/* + add to cart ({nextPrice} ETH) */}
                                        </button>
                                    </>
                                )}
                        </>
                        )}
                    </>
                }

            </div>

        </div>
    )
};

