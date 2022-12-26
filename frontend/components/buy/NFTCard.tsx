import { useEffect, useState } from "react";
import { useNextPrice } from '../../hooks/read/useNextPrice';
import { useTokenExists } from '../../hooks/read/useTokenExists';
import { useCart } from "react-use-cart";
import { BigNumber } from "ethers";
const getCartItemId = (id) => {
    return `${id}`;
}

export const NFTCard = (
    { id }: {
        id: string,
    }) => {

    const { addItem, inCart, items } = useCart();
    const [nextPrice, setNextPrice] = useState<number>();
    const [isInCart, setIsInCart] = useState<boolean>(false);
    const [isAvailable, setIsAvailable] = useState<boolean>(true);
    const { data, isError: isErrorPrice, isLoading: isLoadingPrice } = useNextPrice();
    const { data: TE, isError: isErrorTE, isLoading: isLoadingTE } = useTokenExists(BigNumber.from(id ? id : "0"));

    useEffect(() => {
        if (data) {
            setNextPrice(data);
        }
    }, [data]);

    useEffect(() => {
        if (TE) {
            console.log(`te`, TE);
            setIsAvailable(false);
        }
    }, [TE]);
    useEffect(() => {
        if (isErrorTE) {
            console.log(`isErrorTE`, isErrorTE);
        }
    }, [isErrorTE]);


    useEffect(() => {
        setIsInCart(inCart(getCartItemId(id)));
    }, [id, items]);

    const imageURL = "/ipfsdata/nft-placeholder.jpeg";

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
        <div className="border-solid border-2 w-60 rounded-xl border-slate-500">
            <img
                // TODO: add loading placeholder picture in /public/ipfsdata
                src={`${imageURL}`}
                className="w-full rounded-xl"
                alt=""
            />
            <div className="px-2">
                <div>NFT #{id}</div>
                {(!isAvailable) ? (
                    <p>TODO: NFT has an owner...</p>

                ) : (
                    <>
                        {(isInCart) ? (
                            <p>TODO: NFT is already in Cart</p>
                        ) : (
                            <>
                                {(isLoadingPrice) ? (
                                    <p>TODO: NFT Price loading</p>
                                ) : (
                                    <>
                                        {(isErrorPrice) ? (
                                            <p>TODO: NFT Price Error</p>
                                        ) : (
                                            <button
                                                className='btn text-white bg-gradient-to-r from-pink-500 to-violet-500'
                                                onClick={() => addToCart(id)}>
                                                Add to cart for {nextPrice} ETH
                                            </button>
                                        )}

                                    </>
                                )}
                            </>
                        )}
                    </>
                )}

            </div>

        </div>
    )
};

