import { useCart } from "react-use-cart";

export const Cart = () => {

    const {
        isEmpty,
        totalUniqueItems,
        items,
        removeItem,
        cartTotal
    } = useCart();

    const buyPopup = (items) => {
        // TODO: purchase all NFTs
        // 1. list items + pics
        // 2. determine point on price curve ( = amount of NFTs in existence in this collection )
        // 3. calculate total price by stepping through price curve
        // 4. optional: set price slippage
        // 5. send Tx
    }

    if (isEmpty) return <p>Your cart is empty</p>;

    return (
        <>
            <h1>Cart ({totalUniqueItems})</h1>
            <br />
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        {item.name} &mdash;
                        <button onClick={() => removeItem(item.id)}>&times;</button>
                    </li>
                ))}
            </ul>
            <b>Total: {cartTotal} ETH</b>
            <br />
            <button
                className='btn text-white bg-gradient-to-r from-pink-500 to-violet-500'
                onClick={() => { buyPopup(items) }}>
                {(totalUniqueItems === 1) ? (
                    <span>Mint this NFT</span>
                ) : (
                    <span>Mint these {totalUniqueItems} NFTs</span>
                )}
            </button>
        </>
    );
};