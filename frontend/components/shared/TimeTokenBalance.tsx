import { useEffect, useState } from "react";
import { useAccount } from 'wagmi'
import { useTimeTokenBalance } from '../../hooks/read/useTimeTokenBalance';
import { useNftBalance } from '../../hooks/read/useNftBalance';

export const TimeTokenBalance = ({ baseOffset, totalItems }) => {
    const [timeTokenBalanceViz, setTimeTokenBalanceViz]: [number, any] = useState();
    const { address: ownerAddress } = useAccount();
    const { data: timeTokenBalance } = useTimeTokenBalance({ ownerAddress });

    useEffect(() => {
        if (timeTokenBalance) {
            setTimeTokenBalanceViz(timeTokenBalance.toString());
        }
    }, [timeTokenBalance]);

    if (!timeTokenBalanceViz) {
        return null;
    }

    return (
        <>
            TimeTokens {timeTokenBalanceViz}
        </>
    )

};