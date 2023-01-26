import {
    usePrepareContractWrite,
    useContractWrite,
} from "wagmi";
import ChainConfig from "../../chainconfig.json";
import { utils, BigNumber } from "ethers";
import { useState } from "react";

export function useSubmitVote(nftId: BigNumber, onSuccess: Function) {

    const [storyHash, setStoryHash] = useState<string>("");

    // const v2 = value.add(BigNumber.from("1000000000000000000000000"));
    // uint256 _nftId,
    // string memory _hash

    const { config } = usePrepareContractWrite({
        address: ChainConfig.proposalVoter.address,
        abi: ChainConfig.proposalVoter.abi,
        functionName: 'submitVote',
        args: [nftId,storyHash],
        // overrides: {
        //     value
        // },
    });

    // console.log(`---------`)
    // ids?.map((id,i)=>{
    //     console.log(`${i}. `,id.toNumber());
    // })
    // console.log(`value`,utils.formatEther(value));
    // console.log(`buy config`,config);
    // console.log(`---------`)

    const { data, isLoading, isSuccess, write } = useContractWrite({
        ...config,
        onSuccess(data) {
            onSuccess(data);
        },
      })
    return { data, setStoryHash, isLoading, isSuccess, write };
}
