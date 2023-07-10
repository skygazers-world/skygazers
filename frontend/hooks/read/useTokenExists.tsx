import { useContractRead } from "wagmi";
import ChainConfig from "../../chainconfig";
import { BigNumber } from "ethers";
export function useTokenExists(tokenId: BigNumber,
) {
  // const { data, isError, isLoading } = 
  return useContractRead({
    address: ChainConfig.skygazers.address,
    abi: ChainConfig.skygazers.abi,
    functionName: 'exists',
    cacheOnBlock: true,
    args: [tokenId],
  });
  // return { data, isError, isLoading };
}
