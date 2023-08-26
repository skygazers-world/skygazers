import type { NextPage } from 'next';
import Navbar from 'components/shared/navbar';
import ChainConfig from "../chainconfig";

const My: NextPage = () => {
    return (
        <div className='flex flex-col justify-start items-start'>
            <Navbar />
            <h1>chain {process.env.NEXT_PUBLIC_CHAIN}</h1>
            <ol>
                {Object.keys(ChainConfig).map((key) => {
                    const contract = ChainConfig[key];
                    return (<li>{key} : {contract.address}</li>)
                })}
            </ol>
        </div>
    );
};

export default My;
