import { useContractRead } from "wagmi";
import ChainConfig from "../../chainconfig.json";
import { utils, ethers } from "ethers";

export function useNextPrice() {
  const { data: p, isError, isLoading } = useContractRead({
    address: ChainConfig.curveSaleMinter.address,
    abi: ChainConfig.curveSaleMinter.abi,
    functionName: 'p',
    // args: [ownerAddress],
  });
  const data = p ? utils.formatEther(p) : ethers.BigNumber.from("0").toString();
  return { data, isError, isLoading };
}
