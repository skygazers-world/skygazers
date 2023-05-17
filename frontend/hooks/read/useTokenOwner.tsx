import { useContractRead } from "wagmi";
import ChainConfig from "../../chainconfig";
import { BigNumber } from "ethers";
export function useTokenOwner(tokenId: BigNumber,
) {
  // if (!tokenId) {
  //   console.log(`tokenId id null!`);
  // } else {
  //   console.log(`tokenId`, tokenId.toString());
  // }

  const { data, isError, isLoading } = useContractRead({
    address: ChainConfig.skygazers.address,
    abi: ChainConfig.skygazers.abi,
    functionName: 'ownerOf',
    cacheOnBlock: true,
    args: [tokenId],
  });
  return { data, isError, isLoading };
}