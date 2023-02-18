import Link from 'next/link';

type CardProps = {
    id: String;
};

const getCartItemId = (id) => {
    return `skygazer-${id}`;
}

export const NFTCard = ({ id }: CardProps) => {
    const title = null;
    const imageURL = `${process.env.NEXT_PUBLIC_IPFS_ROOT}${id}_660.jpeg`;
    return (
        <Link href={`/skygazer/${id}`}>
        <div className="w-full">
            <img
                src={`${imageURL}`}
                className="w-full rounded-xl lg:hover:scale-105"
                alt=""
            />
            <div className="w-full flex flex-row items-center justify-start min-h-[20px] text-sgbodycopy mt-[15px]">
                <div className="text-sgbodycopy text-[12px] font-gatwickbold"> #{id}</div>
            </div>
            {title?
            <h1 className='text-[18px] leading-[24px]'>Title here</h1>

            :
            <p className='italic text-[14px] opacity-50'>No draft yet.</p>
            }
        </div>
        </Link>
    )
};

