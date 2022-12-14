import { useContractRead } from "wagmi";
import ChainConfig from "../../chainconfig.json";
import { BigNumber } from "ethers";

export function useNftBalance({
  ownerAddress
}: {
  ownerAddress: string,
}) {

  const { data, isError, isLoading } = useContractRead({
    address: ChainConfig.skygazers.address,
    abi: ChainConfig.skygazers.abi,
    functionName: 'balanceOf',
    args: [ownerAddress],
    select: (data) => { return BigNumber.from(data) }
  })
  return { data, isError, isLoading };
}
