import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAccount } from "wagmi"
import Navbar from 'components/shared/navbar';
import Footer from 'components/shared/footer';
import { MySkygazers } from 'components/my/MySkygazers';


const My: NextPage = () => {
    return (
        <div className="" data-theme="winter">
            <Head>
                <title>Skygazers | my skygazers </title>
                <meta
                    name="description"
                    content="Skygazers Framework"
                />
                <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>SG</text></svg>" />
            </Head>
                <Navbar />

                <main className="flex flex-col justify-center items-center min-h-[93vh]">

                    <div className={`w-3/5 p-4 my-6 border-2 border-violet-500 rounded-md bg-white`}>
                        <div className='text-center font-bold my-2'>My Skygazers</div>

                        <MySkygazers/>

                    </div>
                </main>
           
            <Footer />
        </div >
    );
};

export default My;
