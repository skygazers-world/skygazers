import { useContractRead } from "wagmi";
import ChainConfig from "../../chainconfig.json";
import { utils, ethers } from "ethers";

export function useNFTBalance(ownerAddress) {
  const { data, isError, isLoading } = useContractRead({
    address: ChainConfig.skygazers.address,
    abi: ChainConfig.skygazers.abi,
    functionName: 'balanceOf',
    cacheOnBlock: true,
    args: [ownerAddress],
  });

  return { data, isError, isLoading };
}
