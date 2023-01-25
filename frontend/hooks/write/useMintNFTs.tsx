import {
    usePrepareContractWrite,
    useContractWrite,
} from "wagmi";
import ChainConfig from "../../chainconfig.json";
import { utils, BigNumber } from "ethers";

export function useMintNFTs(ids: BigNumber[], value: BigNumber) {

    // const v2 = value.add(BigNumber.from("1000000000000000000000000"));

    const { config } = usePrepareContractWrite({
        address: ChainConfig.curveSaleMinter.address,
        abi: ChainConfig.curveSaleMinter.abi,
        functionName: 'mintItems',
        args: [ids],
        overrides: {
            value
        },
    });

    console.log(`---------`)
    ids?.map((id,i)=>{
        console.log(`${i}. `,id.toNumber());
    })
    console.log(`value`,utils.formatEther(value));
    console.log(`buy config`,config);
    console.log(`---------`)

    const { data, isLoading, isSuccess, write } = useContractWrite(config)
    return { data, isLoading, isSuccess, write };
}
