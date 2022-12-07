import { useContractRead } from "wagmi";
import ChainConfig from "../../chainconfig.json";
  
export function useNftBalance( {
    ownerAddress
  }: {
    ownerAddress: string,
  }) {

    const { data, isError, isLoading } = useContractRead({
        address: ChainConfig.skygazers.address,
        abi: ChainConfig.skygazers.abi,
        functionName: 'balanceOf',
        args: [ownerAddress],
    })

    // console.log(`data = ${data}`)
    // console.log(`isError = ${isError}`)
    // console.log(`isLoading = ${isLoading}`)

    return { data, isError, isLoading };
}
  