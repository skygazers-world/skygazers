import { useEffect, useState } from "react";
import ChainConfig from "../../chainconfig.json";
import { ethers } from "ethers";
import { useProposals } from '../../hooks/read/useProposals';

const Proposal = ({propcont}) => {
    const [isExpanded,setIsExpanded] = useState(false); 
    const proposal = propcont;
    const dummyding = {
        title:'THE DAY OF which they never spoke again',
        owner:'0x678...ml9',
        nftnmbr: proposal.nftId.toNumber(),
        nftimg:'/ipfsdata/nft-placeholder.jpeg',
        expcont:"Some more vote info MENNEKE!",
        votestatus:"You haven't voted yet.",
    };
    return(
        <div className="w-full border-b-2 border-sgbodycopy border-opacity-5 flex flex-col justify-start items-start pt-[30px]">
            <div onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer w-full flex flex-row justify-start items-end pl-[6.4vw] pr-[11vw]">
                <div className="w-[140px] h-[70px] flex flex-row justify-start items-start mr-[40px]">
                    <div className={isExpanded?"transition-all ease-in-out w-[12px] h-[12px] rotate-90 mr-2 mt-1":" transition-all ease-in-outw-[9px] h-[12px] rotate-0  mr-2 mt-1"}>
                        <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 6L-4.89399e-07 11.1962L-3.51373e-08 0.803847L9 6Z" fill="#59342B"/>
                        </svg>
                    </div>
                    <h2 className="text-[14px] leading-[18px]">Adventure<br />accept</h2>
                </div>
                <div className="w-[70px] h-[70px] bg-slate-200"><img src={`${dummyding.nftimg}`} /></div>
                <div className="flex flex-1 flex-col justify-end items-start ml-[30px]">
                    <h2 className="flex-1 uppercase text-[18px] leading-[24px] max-w-[460px]">{dummyding.title}</h2>
                    <div className="flex flex-row justify-start items-start text-[14px] mt-[8px]">
                        <p className="mr-[20px] font-bold">#{dummyding.nftnmbr}</p>
                        <p>owned by <a className="underline">{dummyding.owner}</a></p>
                    </div>
                </div>
                <p>{dummyding.votestatus}</p>

           </div>
           {isExpanded?
           <div className="w-full pl-[6.4vw] py-6 opacity-50"><p>{dummyding.expcont}</p></div>
           :
           null
           }
           <div className="w-[140px] h-[18px] bg-[#572B0B] bg-opacity-10  ml-[6.4vw]">
           </div>
        
        {/* Proposal for NFT {proposal.nftId.toNumber()} - {proposal.hash} */}
        </div>
        
    )
}


export const Proposals = () => {

    const { data, isError, isLoading } = useProposals();
    const [loading,setLoading]  =useState(true);

    const [proposals, setProposals] = useState<any>([]);

    let provider;
    let signer;
    let ProposalVoterContract;

    useEffect(() => {
        const { ethereum } = window;
        if (ethereum) {
            provider = new ethers.providers.Web3Provider(ethereum as any);
            signer = provider.getSigner();

            ProposalVoterContract = new ethers.Contract(
                ChainConfig.proposalVoter.address,
                ChainConfig.proposalVoter.abi,
                signer
            );
        }
    });

    useEffect(() => {
        if (isError) {
            console.log(`Err`, isError);
        }
        if (data) {
            console.log(`got proposals`, data);
            setProposals(data);
        }
        setLoading(isLoading);
    }, [data, isError, isLoading]);

    if (loading){
        return (
            <div>Zo ne laad-dinges met van die flapperende gradients die zo van links naar rechts gaan gelijk ne ruitewisser, ge kent da wel.</div>
        )
    }

    if (proposals.length === 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                No proposals yet. <br />
            </div>
        )
    }

    return (
        <>
        {proposals.map((proposal) => (
            <Proposal propcont={proposal} key={proposal.nftId.toNumber()} />
        ))}
        </>
    )

};