import { useEffect, useState } from "react";
import { useAccount } from 'wagmi'
import { useTimeTokenBalance } from '../../hooks/read/useTimeTokenBalance';

export const TimeTokenBalance = () => {
    const [timeTokenBalance, setTimeTokenBalance]: [number, any] = useState();
    const { address: ownerAddress } = useAccount();
    const { data } = useTimeTokenBalance({ ownerAddress });

    useEffect(() => {
        if (data) {
            setTimeTokenBalance(data.toString());
        }
    }, [data]);

    if (!timeTokenBalance) {
        return null;
    }

    return (
        <p>
            TimeTokens {timeTokenBalance}
        </p>
    )

};