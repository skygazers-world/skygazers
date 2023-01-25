import { useContractRead } from "wagmi";
import ChainConfig from "../../chainconfig.json";
import { BigNumber } from "ethers";
export function useTokenExists(tokenId: BigNumber,
) {
  // if (!tokenId) {
  //   console.log(`tokenId id null!`);
  // } else {
  //   console.log(`tokenId`, tokenId.toString());
  // }

  const { data, isError, isLoading } = useContractRead({
    address: ChainConfig.skygazers.address,
    abi: ChainConfig.skygazers.abi,
    functionName: 'exists',
    cacheOnBlock: true,
    args: [tokenId],
  });
  return { data, isError, isLoading };
}
