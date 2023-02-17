import { useContractRead } from "wagmi";
import ChainConfig from "../../chainconfig";
import { utils, ethers, BigNumber } from "ethers";

export function useNextPrice() {
  const { data: p, isError, isLoading } = useContractRead({
    address: ChainConfig.curveSaleMinter.address,
    abi: ChainConfig.curveSaleMinter.abi,
    functionName: 'p',
    cacheOnBlock: true,
    select: (data) => { return BigNumber.from(data) }
  });
  const data = p ? parseFloat(utils.formatEther(p)) : parseFloat(ethers.BigNumber.from("0").toString());
  return { data, isError, isLoading };
}
