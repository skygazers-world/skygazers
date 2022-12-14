import { useContractRead } from "wagmi";
import ChainConfig from "../../chainconfig.json";
import { BigNumber } from "ethers";

export function useTimeTokenBalance({
  ownerAddress
}: {
  ownerAddress: string,
}) {

  const { data, isError, isLoading } = useContractRead({
    address: ChainConfig.timeToken.address,
    abi: ChainConfig.timeToken.abi,
    functionName: 'balanceOf',
    args: [ownerAddress],
    select: (data) => { return BigNumber.from(data) }
  })
  return { data, isError, isLoading };
}
