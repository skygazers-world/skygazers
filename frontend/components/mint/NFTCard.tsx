import { useEffect, useState } from "react";
import config from "../../config.json";
import { useNextPrice } from '../../hooks/read/useNextPrice';
import { CartProvider, useCart } from "react-use-cart";

type CardProps = {
    id: String;
};

const getCartItemId = (id) => {
    return `skygazer-${id}`;
}

export const NFTCard = ({ id }: CardProps) => {

    const { addItem, inCart } = useCart();

    const [nextPriceViz, setNextPriceViz] = useState();
    const { data: nextPrice } = useNextPrice();

    useEffect(() => {
        setNextPriceViz(nextPrice);
    }, [nextPrice]);
    const imageURL = "/ipfsdata/nft-placeholder.jpeg";

    const addToCart = (id) => {
        console.log(`adding ${id}`);
        addItem({
            id: getCartItemId(id),
            name: `skygazer #${id}`,
            price: parseFloat(nextPrice.toString()),
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
                {(inCart(getCartItemId(id))) ? (
                    <div>In Cart</div>
                ) : (
                    <button
                        className='btn text-white bg-gradient-to-r from-pink-500 to-violet-500'
                        onClick={() => addToCart(id)}>
                        Add to cart for {nextPriceViz} ETH
                    </button>

                )}
            </div>

        </div>
    )
};

