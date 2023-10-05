import { useEnsName } from "wagmi";
import { useTokenOwner } from '../../hooks/read/useTokenOwner';
import truncateEthAddress from 'truncate-eth-address'
import { BigNumber } from "ethers";
import { useAccount } from "wagmi";

export const NFTOwner = (

    { id }: {
        id: string,
    }) => {

    const { address } = useAccount();

    const { data: tokenOwner, isLoading: isLoadingTokenOwner } = useTokenOwner(BigNumber.from(id));
    const { data: tokenOwnerName } = useEnsName({ address: tokenOwner as `0x${string}` });

    if (isLoadingTokenOwner || (!tokenOwner && !tokenOwnerName)) {
        return null;
    }

    // if owner by me - show a different text
    if (address == tokenOwner) {
        return (<p className="font-gatwickreg text-[12px] text-sgbodycopy text-opacity-50">This Gazer is yours!</p>);

    }

    // owner by someone else
    return (<p className="font-gatwickreg text-[12px] text-sgbodycopy text-opacity-50">minted by <a className="underline text-sgbodycopy text-opacity-50">{tokenOwnerName || truncateEthAddress((tokenOwner) as string)}</a></p>);

};
