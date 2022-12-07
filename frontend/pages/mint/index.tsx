import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAccount, useContractEvent } from "wagmi"
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Navbar from 'components/shared/navbar';
import Footer from 'components/shared/footer';
// import { StakeFormComponent } from 'components/staker/stakeFormComponent';
// import { OperatorWidget } from 'components/staker/operatorWidget';
// import { PoolInfo } from 'components/shared/poolInfo';
import { Gallery } from 'components/mint/Gallery';
import { CartProvider } from "react-use-cart";
import { Cart } from "../../components/mint/Cart";

// import { useDeposit } from '../../hooks/write/useDeposit';
// import { usePoolOwner } from '../../hooks/read/usePoolOwner';
// import StakingPool from "../../utils/StakingPool.json";

const Pool: NextPage = () => {
    const router = useRouter()
    //   const poolAddress = router.query.pool as string ? router.query.pool as string : "notSet"

    //   let etherscanLink = ""

    const { isConnected, address } = useAccount()
    //   const [stakeAmount, setStakeAmount] = useState<string>("0");
    //   const [isDepositing, setIsDepositing] = useState(false);
    //   const { data: poolOwner } = usePoolOwner({ address: poolAddress as string });
    //   const { data, write: deposit } = useDeposit({ address: poolAddress as string, val: stakeAmount });

    // useContractEvent({
    //   addressOrName: poolAddress.toString(),
    //   contractInterface: StakingPool.abi,
    //   eventName: 'Deposit',
    //   listener: (event) => {
    //       console.log(event);
    //   },
    // })

    //   if(data){
    //     etherscanLink = `https://goerli.etherscan.io/tx/${data.hash}`
    //   }

    return (
        <div className="" data-theme="winter">
            <Head>
                <title>Skygazers | mint </title>
                <meta
                    name="description"
                    content="stake eth via ur trusted degen"
                />
                <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧑‍🤝‍🧑</text></svg>" />
            </Head>
            <CartProvider>
                <Cart />
                <Navbar />

                <main className="flex flex-col justify-center items-center min-h-[93vh]">
                    {/* <OperatorWidget operatorAddress={poolOwner?.toString()} /> */}

                    <div className={`w-3/5 p-4 my-6 border-2 border-violet-500 rounded-md bg-white`}>
                        <div className='text-center font-bold my-2'>Kope JONGE?</div>

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
