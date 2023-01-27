import { useEffect, useState } from "react";
import config from "../../config.json";
import { useNextPrice } from '../../hooks/read/useNextPrice';
import Link from 'next/link';

type CardProps = {
    id: String;
};

const getCartItemId = (id) => {
    return `skygazer-${id}`;
}

export const NFTCard = ({ id }: CardProps) => {

    const imageURL = "/ipfsdata/SG_placeholder.png";

    return (
        <Link href={`/skygazer/${id}`}>
        <div className="w-full">
            <img
                src={`${imageURL}`}
                className="w-full rounded-xl"
                alt=""
            />
            <div className="px-2">
                <div>NFT #{id}</div>
            </div>

        </div>
        </Link>
    )
};

