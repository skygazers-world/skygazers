import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAccount, useBalance } from "wagmi"
import Navbar from 'components/shared/navbar';
import Footer from 'components/shared/footer';
import { Gallery } from 'components/mint/Gallery';
import { CartProvider } from "react-use-cart";
import { useContractRead } from "wagmi";
import ChainConfig from "../../chainconfig";
import { utils, ethers, BigNumber } from "ethers";
import { useEffect, useState } from 'react';

const PaymentSplitterBalance = () => {
    const { data, isError, isLoading } = useBalance({
        address: ChainConfig.paymentSplitter.address,
    });
    if (isLoading) return <div>Fetching balance…</div>
    if (isError) return <div>Error fetching balance</div>
    return (
        <>
            {data?.formatted} {data?.symbol}
        </>
    )
}

const MySplitterReleaseAmount = ({ owneraddress }) => {

    const { data, isError, isLoading } = useContractRead({
        address: ChainConfig.paymentSplitter.address,
        abi: ChainConfig.paymentSplitter.abi,
        functionName: 'releasable',
        cacheOnBlock: true,
        args: [owneraddress],
        select: (data) => { return BigNumber.from(data) }
    });
    if (isLoading) return <div>Fetching balance…</div>
    if (isError) return <div>Error fetching balance</div>
    return (
        <>
            {data}
        </>
    )
}

const Util: NextPage = () => {
    // price of the current NFT
    const { address: ownerAddress } = useAccount();
    if (!ownerAddress) return null;
    const useNextPrice = () => {
        const { data: p, isError, isLoading } = useContractRead({
            address: ChainConfig.paymentSplitter.address,
            abi: ChainConfig.paymentSplitter.abi,
            functionName: 'totalShares',
            cacheOnBlock: true,
            select: (data) => { return BigNumber.from(data) }
        });
        const data = p ? parseFloat(utils.formatEther(p)) : parseFloat(ethers.BigNumber.from("0").toString());
        return { data, isError, isLoading };
    }

    const { data, isError, isLoading } = useNextPrice();
    const [nextPrice, setNextPrice] = useState<number>();
    useEffect(() => setNextPrice(data), [data]);

    return (
        <>
            <Navbar />
            <ul>
                <li>Paymentsplitter balance <PaymentSplitterBalance /></li>
                {/* <li>Your releasable <MySplitterReleaseAmount owneraddress={ownerAddress} /></li> */}
                {/* <li>totalShares: {nextPrice}</li> */}
            </ul>
        </>
    );
};

export default Util;
