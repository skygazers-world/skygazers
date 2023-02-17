import { useState, useEffect } from 'react';
import { create } from 'ipfs-http-client'

const ipfs = create({ url: process.env.NEXT_PUBLIC_IPFS_API });

export const useIpfsWrite = () => {
        const write = async (data: string) => {
                const { cid } = await ipfs.add(data);
                return await cid.toString();
        }
        return ({ write });
};
