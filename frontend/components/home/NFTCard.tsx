import { useEffect, useState } from "react";
import config from "../../config.json";
import { useNextPrice } from '../../hooks/read/useNextPrice';

type CardProps = {
    id: String;
};

const getCartItemId = (id) => {
    return `skygazer-${id}`;
}

export const NFTCard = ({ id }: CardProps) => {

    const imageURL = "/ipfsdata/nft-placeholder.jpeg";

    return (
        <div className="border-solid border-2 w-60 rounded-xl border-slate-500">
            <img
                src={`${imageURL}`}
                className="w-full rounded-xl"
                alt=""
            />
            <div className="px-2">
                <div>NFT #{id}</div>
            </div>

        </div>
    )
};

