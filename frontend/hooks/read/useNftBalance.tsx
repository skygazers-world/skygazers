import { useContractRead } from "wagmi";
import ChainConfig from "../../chainconfig.json";
  
export function useNftBalance( {
    ownerAddress
  }: {
    ownerAddress: string,
  }) {

    const { data, isError, isLoading } = useContractRead({
        addressOrName: ChainConfig.skygazers.address,
        contractInterface: ChainConfig.skygazers.abi,
        functionName: 'balanceOf',
        args: [ownerAddress],
    })

    // console.log(`data = ${data}`)
    // console.log(`isError = ${isError}`)
    // console.log(`isLoading = ${isLoading}`)

    return { data, isError, isLoading };
}
  