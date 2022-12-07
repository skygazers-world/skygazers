import { useCart } from "react-use-cart";

export const MintConfirmation = () => {

    const {
        items,
        cartTotal,
        totalUniqueItems,
        removeItem,
    } = useCart();

    const tx = (items) => {
        // buy it jonge
    }

    return (
        <>
            <h1>Purchase confirmation for ({totalUniqueItems}) NFTs</h1>
            <br />
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        {item.name} &mdash;
                    </li>
                ))}
            </ul>
            <b>Total: {cartTotal} ETH</b>
            <br />
            <button
                className='btn text-white bg-gradient-to-r from-pink-500 to-violet-500'
                onClick={() => { tx(items) }}>

                <span>OK go ahead</span>

            </button>
        </>
    );
};