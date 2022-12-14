import { useContractRead } from "wagmi";
import ChainConfig from "../../chainconfig.json";

export function useCurveMinterIndex() {
  const { data, isError, isLoading } = useContractRead({
    address: ChainConfig.curveSaleMinter.address,
    abi: ChainConfig.curveSaleMinter.abi,
    functionName: 'currentIndex',
  });
  return { data, isError, isLoading };
}
