import type { NextPage } from 'next';
import {  useBalance } from "wagmi"
import Navbar from 'components/shared/navbar';
import { useContractRead } from "wagmi";
import ChainConfig from "../../chainconfig";
import { utils, BigNumber } from "ethers";

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

const Payee = ({ index, name }) => {
    const { data, isError, isLoading } = useContractRead({
        address: ChainConfig.paymentSplitter.address,
        abi: ChainConfig.paymentSplitter.abi,
        functionName: 'payee',
        args: [index],
    });
    if (isLoading) return <div>Fetching payee..</div>
    if (isError) return <div>Error fetching payee address for index {index}</div>
    return (
        <>
            Releasable for {data} ({name})= <Releasable address={data} />
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
                <> - <Release address={address} /></>
            )}
        </>
    )
}

const Release = ({ address }) => {
    const { config } = usePrepareContractWrite({
        address: ChainConfig.paymentSplitter.address,
        abi: ChainConfig.paymentSplitter.abi,
        functionName: 'release',
        args: [address],
    });

    const { data, isLoading, write, isSuccess } = useContractWrite(config);

    if (isLoading) {
        return (<>Withdrawing...</>)
    }

    if (isSuccess) {
        return (<>Success!! <pre>{JSON.stringify(data, null, 2)}</pre></>);
    }

    return (
        <button className='smallyellowpillbtn bg-sgorange' onClick={() => write()}>release funds</button>
    )
}

const TokenURI = () => {
    const { data, isError, isLoading } = useContractRead({
        address: ChainConfig.skygazers.address,
        abi: ChainConfig.skygazers.abi,
        functionName: 'tokenURI',
        args: [0]
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
    return (
        <>
            <Navbar />
            <ul>
                <li>Paymentsplitter balance <PaymentSplitterBalance /></li>
                <li><Payee index={0} name="multisig" /></li>
                <li><Payee index={1} name="s" /></li>
                <li><Payee index={2} name="b" /></li>
                <li><TokenURI /></li>
                <li>TimeToken = {ChainConfig.timeToken.address}</li>
            </ul>
        </>
    );
};

export default Util;
