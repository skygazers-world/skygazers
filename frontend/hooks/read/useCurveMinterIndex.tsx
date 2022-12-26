import { useContractRead } from "wagmi";
import ChainConfig from "../../chainconfig.json";
import { BigNumber } from "ethers";

export function useCurveMinterIndex() {
  const { data: p, isError, isLoading } = useContractRead({
    address: ChainConfig.curveSaleMinter.address,
    abi: ChainConfig.curveSaleMinter.abi,
    functionName: 'currentIndex',
    cacheOnBlock: true,
    select: (data) => { return BigNumber.from(data) }
  });
  const data = p ? p.toNumber() : 0;
  return { data, isError, isLoading };
}
