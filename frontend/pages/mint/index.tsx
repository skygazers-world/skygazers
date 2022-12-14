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
        <div className="">
            <Head>
                <title>Skygazers | mint </title>
                <meta
                    name="description"
                    content="Skygazers Framework"
                />
                <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>SG</text></svg>" />
            </Head>
            <CartProvider>
                {/* <Cart /> */}
                <Navbar />

                <main className="flex flex-col justify-center items-center pt-[240px]">

                    <div className={`w-3/5 p-4 my-6 border-2 border-violet-500 rounded-md bg-white`}>
                        <div className='text-center font-bold my-2'>Mint your skygazer</div>

                        {/* 
                            baseOffset = what offset in our NFT collection do we start from
                            totalItems = total items in this collection
                        */}
                        <Gallery baseOffset={0} totalItems={3000} />

                    </div>
                </main>
            </CartProvider>
            <Footer />
        </div >
    );
};

export default Pool;
