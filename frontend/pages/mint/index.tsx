import type { NextPage } from 'next';
import Navbar from 'components/shared/navbar';
import { Gallery } from 'components/mint/Gallery';
import { CartProvider } from "react-use-cart";


const Pool: NextPage = () => {
    return (
        <>
            <Navbar />
            <CartProvider>
                <Gallery baseOffset={0} />
            </CartProvider>
        </>
    );
};

export default Pool;
