import { useContractRead } from "wagmi";
import ChainConfig from "../../chainconfig.json";

export function useProposals() {
  const { data, isError, isLoading } = useContractRead({
    address: ChainConfig.proposalVoter.address,
    abi: ChainConfig.proposalVoter.abi,
    functionName: 'getVotes',
    // args: [0],
    // cacheOnBlock: true
  });
  return { data, isError, isLoading };
}
