import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAccount } from "wagmi"
import Navbar from 'components/shared/navbar';
import Footer from 'components/shared/footer';
import { Gallery } from 'components/mint/Gallery';
import { CartProvider } from "react-use-cart";


const Pool: NextPage = () => {
    return (
        <CartProvider>
            <div className='text-center font-bold my-2'>Mint your skygazer</div>
            <Gallery baseOffset={0} totalItems={3000} />
        </CartProvider>
    );
};

export default Pool;
