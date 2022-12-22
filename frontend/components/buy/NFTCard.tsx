import { useEffect, useState } from "react";
import { useNextPrice } from '../../hooks/read/useNextPrice';
import { useCart } from "react-use-cart";

const getCartItemId = (id) => {
    return `skygazer-${id}`;
}

export const NFTCard = (
    { id }: {
        id: string,
    }) => {

    const { addItem, inCart, items } = useCart();
    const [nextPrice, setNextPrice] = useState<number>();
    const [isInCart, setIsInCart] = useState<boolean>(false);
    const { data, isError: isErrorPrice, isLoading: isLoadingPrice } = useNextPrice();

    useEffect(() => {
        if (data) {
            setNextPrice(data);
        }
    }, [data]);



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
            // price: parseFloat(nextPrice.toString()),
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
            </div>

        </div>
    )
};

