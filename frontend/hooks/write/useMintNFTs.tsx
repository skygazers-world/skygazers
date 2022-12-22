import {
    usePrepareContractWrite,
    useContractWrite,
} from "wagmi";
import ChainConfig from "../../chainconfig.json";
import { BigNumber } from "ethers";

export function useMintNFTs(ids: BigNumber[], value: BigNumber) {

    const { config } = usePrepareContractWrite({
        address: ChainConfig.curveSaleMinter.address,
        abi: ChainConfig.curveSaleMinter.abi,
        functionName: 'mintItems',
        args: [ids],
        overrides: {
            value
        },
    });

    const { data, isLoading, isSuccess, write } = useContractWrite(config)
    return { data, isLoading, isSuccess, write };
}
