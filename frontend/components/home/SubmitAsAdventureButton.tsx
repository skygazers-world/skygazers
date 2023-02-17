import { useEffect, useState } from "react";
import ChainConfig from "../../chainconfig";
import { BigNumber, ethers } from "ethers";
import { useProposals } from '../../hooks/read/useProposals';
import { useIpfsRead } from '../../hooks/read/useIpfsRead';
import { useIpfsWrite } from '../../hooks/write/useIpfsWrite';
import { useSubmitVote } from '../../hooks/write/useSubmitVote';

export const SubmitAsAdventureButton = ({ id, getpayload }) => {

    const { write: ipfsWrite } = useIpfsWrite();
    const [submitting, setSubmitting] = useState(false);
    const [txHash, setTxHash] = useState();
    const { data, setStoryHash, isLoading, write } = useSubmitVote(BigNumber.from(id), (data) => {
        console.log(`BIG SUCCESS - txHash=${data.hash}`);
        setTxHash(data.hash);
    });

    useEffect(() => {
        setSubmitting(isLoading);
    }, [isLoading]);

    const onSubmitAsAdventure = () => {
        const payload = getpayload() as Story;
        ipfsWrite(JSON.stringify(payload)).then((cid) => {
            setStoryHash(cid);
            write();
        });
    }

    // when Tx was successful - txHash is filled in..
    if (txHash) {
        return (<button disabled={true} className='bigrounded bg-sggreen text-sgbodycopy ml-[11vw]'>submitted as txhash {txHash}</button>)
    }

    // when in the process of submitting (metamask = open) submitting is true
    if (submitting) {
        return (<button disabled={true} className='bigrounded bg-sggreen text-sgbodycopy ml-[11vw]'>I am submitting...</button>);
    }

    // if neither is true... show the submit button...
    return (
        <button className='bigrounded bg-sggreen text-sgbodycopy ml-[11vw]' onClick={() => { onSubmitAsAdventure() }}>Submit as adventure</button>
    )

};