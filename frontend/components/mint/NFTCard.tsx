import { useEffect, useState } from "react";
import { useEnsName, useSendTransaction } from "wagmi";
import { useNextPrice } from '../../hooks/read/useNextPrice';
import { useTokenOwner } from '../../hooks/read/useTokenOwner';
import { useCart } from "react-use-cart";
import Icons from "components/shared/Icons";
import truncateEthAddress from 'truncate-eth-address'

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
    const { data: tokenOwner, isError: isErrorTokenOwner, isLoading: isLoadingTokenOwner } = useTokenOwner(BigNumber.from(id));
    const { data: tokenOwnerName } = useEnsName({ address: tokenOwner as `0x${string}` });

    useEffect(() => {
        if (data) {
            setNextPrice(data);
        }
    }, [data]);


    useEffect(() => {
        if (tokenOwner) {
            console.log(`tokenOwner`, tokenOwner);
            setIsAvailable(false);
        }
    }, [tokenOwner]);

    // useEffect(() => {
    //     if (isErrorTokenOwner) {
    //         console.log(`isErrorTokenOwner`, isErrorTokenOwner);
    //     }
    // }, [isErrorTokenOwner]);


    // useEffect(() => {
    //     if (isLoadingTokenOwner) {
    //         console.log(`isLoadingTokenOwner`, isLoadingTokenOwner);
    //     }
    // }, [isLoadingTokenOwner]);

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
            {isAvailable ?
                <div onClick={isInCart ? () => { removeItem(getCartItemId(id)) } : () => addToCart(id)} className="w-full relative mb-2 opacity-100 bg-[#F7F5F4] cursor-pointer transition-all lg:hover:scale-[1.02] ">
                    <div className={isInCart ? "z-10 absolute bottom-0 right-0 px-3 py-3 bg-transparent opacity-100" : "z-10 absolute bottom-0 right-0 px-3 py-3 bg-transparent opacity-50"}>
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
                <div className="w-full  ease-in-out relative mb-2 transition-all bg-[#F7F5F4] ">
                    <div className="flex flex-col justify-end items-end z-10 absolute top right-0 px-4 pb-4 bg-[rgba(255,255,255,0.25)] w-full h-full ">
                        <p className="font-gatwickbold bg-white text-sgbodycopy py-1 rounded-[4px] px-2 text-[12px] uppercase">Sold!</p>
                    </div>
                    <img
                        src={`${imageURL}`}
                        className="w-full rounded-xl"
                        alt=""
                    />
                </div>

            }
            <div className="w-full flex flex-row items-center justify-center min-h-[45px] text-sgbodycopy">
                <div className={isAvailable ? "text-sgbodycopy text-[12px] font-gatwickbold" : "text-sgbodycopy text-[12px] font-gatwickreg"}> #{id}</div>
                <div className="flex-1"></div>
                {isLoadingTokenOwner ?
                    <div className="w-[120px] h-[18px] bg-[#F7F5F4] rounded-[9px]">
                    </div>
                    :
                    <>
                        {(!isAvailable) ? (
                            <p className="font-gatwickreg text-[12px] text-sgbodycopy text-opacity-50">minted by <a className="underline text-sgbodycopy text-opacity-50">{tokenOwnerName || truncateEthAddress((tokenOwner) as string)}</a></p>
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
                                            className='smallyellowpillbtn bg-sgorange'
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

