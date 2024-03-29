import { useState, useEffect } from "react";
import { useContractRead } from "wagmi";
import ChainConfig from "../../chainconfig";
import { BigNumber } from "ethers";
export function useTokenOwner(tokenId: BigNumber,
) {
  // const { data, isError, isLoading } = 
  return useContractRead({
    address: ChainConfig.skygazers.address,
    abi: ChainConfig.skygazers.abi,
    functionName: 'ownerOf',
    cacheOnBlock: true,
    args: [tokenId],
  });
  // return { data, isError, isLoading };
}
