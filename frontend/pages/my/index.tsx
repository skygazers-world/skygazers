import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAccount } from "wagmi"
import Navbar from 'components/shared/navbar';
import Footer from 'components/shared/footer';
import { MySkygazers } from 'components/my/MySkygazers';


const My: NextPage = () => {
    return (
        <>
            <div className='text-center font-bold my-2'>My Skygazers</div>
            <MySkygazers />
        </>
    );
};

export default My;
