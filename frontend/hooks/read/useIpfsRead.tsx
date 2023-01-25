import { useState, useEffect } from 'react';
import { create } from 'ipfs-http-client'

const ipfs = create({ url: process.env.NEXT_PUBLIC_IPFS_API });

export const useIpfsRead = (hash) => {
        const [data, setData] = useState<string>();
        const [isLoading, setIsLoading] = useState<boolean>(false);

        useEffect(() => {
                let chunks = [];
                async function getData() {
                        setIsLoading(true);
                        for await (const chunk of ipfs.cat(hash)) {
                                chunks.push(chunk);
                        }
                        const d = Buffer.concat(chunks).toString();
                        setData(d);
                        setIsLoading(false);
                }
                getData();
        }, [hash]);

        return ({ data, isLoading });
};
