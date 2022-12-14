import { useEffect, useState } from "react";
import { useNextPrice } from '../../hooks/read/useNextPrice';
import { useCart } from "react-use-cart";

const getCartItemId = (id) => {
    return `skygazer-${id}`;
}

export const NFTCard = (
    { id, price }: {
        id: string,
        price: string,
    }) => {

    const { addItem, inCart, items } = useCart();

    const [inCartViz, setInCartViz]: [boolean, any] = useState(false);
    const { data: nextPrice } = useNextPrice();

    useEffect(() => {
        setInCartViz(inCart(getCartItemId(id)));
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
                src={`${imageURL}`}
                className="w-full rounded-xl"
                alt=""
            />
            <div className="px-2">
                <div>NFT #{id}</div>
                {(inCartViz) ? (
                    <div>In Cart</div>
                ) : (
                    <button
                        className='btn text-white bg-gradient-to-r from-pink-500 to-violet-500'
                        onClick={() => addToCart(id)}>
                        Add to cart for {price} ETH
                    </button>

                )}
            </div>

        </div>
    )
};

