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

import {
    usePrepareContractWrite,
    useContractWrite,
} from "wagmi";


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

// const MySplitterReleaseAmount = ({ owneraddress }) => {
//     const { data, isError, isLoading } = useContractRead({
//         address: ChainConfig.paymentSplitter.address,
//         abi: ChainConfig.paymentSplitter.abi,
//         functionName: 'releasable',
//         cacheOnBlock: true,
//         args: [owneraddress],
//         select: (data) => { return BigNumber.from(data) }
//     });
//     if (isLoading) return <div>Fetching balance…</div>
//     if (isError) return <div>Error fetching balance</div>
//     return (
//         <>
//             {data?.toString()}
//         </>
//     )
// }

const Payee = ({ index }) => {
    const { data, isError, isLoading } = useContractRead({
        address: ChainConfig.paymentSplitter.address,
        abi: ChainConfig.paymentSplitter.abi,
        functionName: 'payee',
        args: [index],
        // select: (data) => { return BigNumber.from(data) }
    });
    if (isLoading) return <div>Fetching payee..</div>
    if (isError) return <div>Error fetching payee address for index {index}</div>
    return (
        <>
            Releasable for {data} = <Releasable address={data} />
        </>
    )
}


const Releasable = ({ address }) => {
    const { data, isError, isLoading } = useContractRead({
        address: ChainConfig.paymentSplitter.address,
        abi: ChainConfig.paymentSplitter.abi,
        functionName: 'releasable',
        args: [address],
        select: (data) => { return BigNumber.from(data) }
    });
    if (isLoading) return <div>Fetching releasable..</div>
    if (isError) return <div>Error fetching releasable for address {address}</div>
    return (
        <>
            {utils.formatEther(data)} ETH
            {data.gt(BigNumber.from(0)) && (
                <> - <Release address={address}/></>
            )}
        </>
    )
}



const Release = ({address}) => {

    // const v2 = value.add(BigNumber.from("1000000000000000000000000"));

    const { config } = usePrepareContractWrite({
        address: ChainConfig.paymentSplitter.address,
        abi: ChainConfig.paymentSplitter.abi,
        functionName: 'release',
        args: [address],
    });

    const  { isError: isMintError, data, isLoading, write, isSuccess } =  useContractWrite(config);

    if (isLoading){
        return(<>Withdrawing...</>)
    }

    if (isSuccess){
        return(<>Success!! <pre>{JSON.stringify(data,null,2)}</pre></>);
    }

    return(
        <button className='smallyellowpillbtn bg-sgorange' onClick={()=>write()}>release funds</button>
    )


}


const TokenURI = () => {
    const { data, isError, isLoading } = useContractRead({
        address: ChainConfig.skygazers.address,
        abi: ChainConfig.skygazers.abi,
        functionName: 'tokenURI',
        args: [0],
        // select: (data) => { return BigNumber.from(data) }
    });
    if (isLoading) return <div>Fetching..</div>
    if (isError) return <div>Error fetching</div>
    return (
        <>
            tokenURI for Skygazers NFT ({ChainConfig.skygazers.address}) = {data}
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
                <li><Payee index={0} /></li>
                <li><Payee index={1} /></li>
                <li><Payee index={2} /></li>
                <li><TokenURI/></li>
            </ul>
        </>
    );
};

export default Util;
