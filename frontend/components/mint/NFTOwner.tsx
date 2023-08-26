import { useEnsName } from "wagmi";
import { useTokenOwner } from '../../hooks/read/useTokenOwner';
import truncateEthAddress from 'truncate-eth-address'
import { BigNumber } from "ethers";

export const NFTOwner = (
    { id }: {
        id: string,
    }) => {

    const { data: tokenOwner, isLoading: isLoadingTokenOwner } = useTokenOwner(BigNumber.from(id));
    const { data: tokenOwnerName } = useEnsName({ address: tokenOwner as `0x${string}` });

    if (isLoadingTokenOwner || (!tokenOwner && !tokenOwnerName)) {
        return null;
    }

    return (<p className="font-gatwickreg text-[12px] text-sgbodycopy text-opacity-50">minted by <a className="underline text-sgbodycopy text-opacity-50">{ tokenOwnerName || truncateEthAddress((tokenOwner) as string)}</a></p>);

};
