import type { NextPage } from 'next';
import { MySkygazers } from 'components/home/MySkygazers';
import Navbar from 'components/shared/navbar';
import { useAccount } from 'wagmi'

const My: NextPage = () => {
    const { address: ownerAddress } = useAccount();

    return (

        <div className='flex flex-col justify-start items-start'>
            {ownerAddress?
                <>
                    <Navbar />
                    <MySkygazers />
                </>

            :
                <div className="w-full h-[100vh]">
                    <div className="w-full bg-[url('/bg_welcome.png')] bg-cover bg-left-top h-full flex flex-col justify-center items-center">
                        <h1 className='uppercase text-white max-w-[70%] text-center'>Welcome traveler</h1>
                        <p className='font-bold max-w-[70%] text-center mt-6 lg:mt-[6px]'>Please connect your wallet for identification.</p>
                    </div>
                </div>
            }
        </div>


);
};

export default My;
