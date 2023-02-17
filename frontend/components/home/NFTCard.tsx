import Link from 'next/link';

type CardProps = {
    id: String;
};

const getCartItemId = (id) => {
    return `skygazer-${id}`;
}

export const NFTCard = ({ id }: CardProps) => {

    const imageURL = `${process.env.NEXT_PUBLIC_IPFS_ROOT}${id}_660.jpeg`;

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

