import { useEffect, useState } from "react";
import ChainConfig from "../../chainconfig.json";
import { BigNumber, ethers } from "ethers";
import { useProposals } from '../../hooks/read/useProposals';
import { useIpfsRead } from '../../hooks/read/useIpfsRead';
import { useIpfsWrite } from '../../hooks/write/useIpfsWrite';
import { useSubmitVote } from '../../hooks/write/useSubmitVote';

export const SubmitAsAdventureButton = ({ getpayload }) => {

    const { write : ipfsWrite } = useIpfsWrite();
    const payload = getpayload() as Story;

    const { setStoryHash, isLoading, write } = useSubmitVote(BigNumber.from(payload.tokenid));

    const onSubmitAsAdventure = () => {
        console.log(`Saving payload`, payload);
        ipfsWrite(JSON.stringify(payload)).then((cid)=>{
            console.log(`CID`,cid);
            setStoryHash(cid);
            write();
        });
        
    }

    // const { data } = useIpfsRead("Qmc5gCcjYypU7y28oCALwfSvxCBskLuPKWpK4qpterKC7z");


    // useEffect(() => {

    //     console.log(`retrieved IPFS data:`, data);


    // }, [data]);

    // const { data, isError, isLoading } = useProposals();
    // const [loading,setLoading]  =useState(true);

    // const [proposals, setProposals] = useState<any>([]);

    // let provider;
    // let signer;
    // let ProposalVoterContract;

    // useEffect(() => {
    //     const { ethereum } = window;
    //     if (ethereum) {
    //         provider = new ethers.providers.Web3Provider(ethereum as any);
    //         signer = provider.getSigner();

    //         ProposalVoterContract = new ethers.Contract(
    //             ChainConfig.proposalVoter.address,
    //             ChainConfig.proposalVoter.abi,
    //             signer
    //         );
    //     }
    // });

    // useEffect(() => {
    //     if (isError) {
    //         console.log(`Err`, isError);
    //     }
    //     if (data) {
    //         console.log(`got proposals`, data);
    //         setProposals(data);
    //     }
    //     setLoading(isLoading);
    // }, [data, isError, isLoading]);

    // if (loading){
    //     return (
    //         <div>Zo ne laad-dinges met van die flapperende gradients die zo van links naar rechts gaan gelijk ne ruitewisser, ge kent da wel.</div>
    //     )
    // }

    // if (proposals.length === 0) {
    //     return (
    //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    //             No proposals yet. <br />
    //         </div>
    //     )
    // }

    return (
        <button className='bigrounded bg-sggreen text-sgbodycopy ml-[11vw]' onClick={() => { onSubmitAsAdventure() }}>Submit as adventure</button>
    )

};