import { useEffect, useState } from "react";
import ChainConfig from "../../chainconfig.json";
import { ethers } from "ethers";
import { useProposals } from '../../hooks/read/useProposals';

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {proposals.map((proposal) => (
                    <div key={proposal.nftId.toNumber()}>
                        Proposal for NFT {proposal.nftId.toNumber()} -> {proposal.hash}
                    </div>
                ))}
            </div>
        </>
    )

};