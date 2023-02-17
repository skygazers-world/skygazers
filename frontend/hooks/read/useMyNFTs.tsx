import { useContractRead } from "wagmi";
import ChainConfig from "../../chainconfig";

export function useNFTBalance({ ownerAddress }: {
  ownerAddress: string,
}) {
  const { data, isError, isLoading } = useContractRead({
    address: ChainConfig.skygazers.address,
    abi: ChainConfig.skygazers.abi,
    functionName: 'balanceOf',
    cacheOnBlock: true,
    args: [ownerAddress],
  });
  return { data, isError, isLoading };
}
