import { NFTCard } from "./NFTCard";
import { ShoppingCart } from "./ShoppingCart";
import ReactPaginate from 'react-paginate';
import { useNextPrice } from '../../hooks/read/useNextPrice';
import { useCurveMinterIndex } from '../../hooks/read/useCurveMinterIndex';
import { useEffect, useState } from 'react';

const itemsPerPage = 50;

const NextPrice = () => {
    const { data, isError, isLoading } = useNextPrice();
    const [nextPrice, setNextPrice] = useState<number>();
    useEffect(() => setNextPrice(data), [data]);
    if (isLoading) return (
        <p className="font-gatwickbold text-sgbodycopy text-[14px] leading-[16px] text-opacity-50 mb-[14px]">Loading current price...</p>
    );

    if (isError) return (
        <p className="font-gatwickreg text-sgorange2 text-[14px] leading-[16px] text-opacity-70 mb-[14px]">Can't fetch current price...</p>
    );

    return (
        <div className="flex w-full flex-col justify-start items-start mb-[14px]">
            <p className="text-[14px] leading-[16px] text-sgbodycopy">current price / gazer *</p>
            <p className="font-gatwickbold text-[20px] text-sgbodycopy">{nextPrice} ETH</p>
        </div>
    );
}

const CurrentIndex = () => {
    const { data, isError, isLoading } = useCurveMinterIndex();
    const [index, setIndex] = useState<number>();
    useEffect(() => setIndex(data), [data]);
    if (isLoading) return (
        <p className="font-gatwickbold text-sgbodycopy text-opacity-50">Loading sold gazers...</p>
    );

    if (isError) return (
        <p className="font-gatwickreg text-sgorange2 text-opacity-70">Can't fetch sold gazers...</p>
    );

    return (
        <div className="flex w-full flex-col justify-start items-start">
        <p className="text-[14px] text-sgbodycopy">gazers sold</p>
        <p className="font-gatwickbold text-[20px] text-sgbodycopy">{index}</p>

    </div>
    );
}


// baseOffset = what offset in our NFT collection do we start from
// totalItems = total items in this collection
export const Gallery = ({ baseOffset, totalItems }) => {
    const [itemOffset, setItemOffset] = useState(0);

    const endOffset = itemOffset + itemsPerPage;

    let nfts = [];
    for (let i = baseOffset + itemOffset; i < baseOffset + endOffset; i++) {
        nfts.push(i);
    }
    const pageCount = Math.ceil(totalItems / itemsPerPage);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % totalItems;
        setItemOffset(newOffset);
    };

    return (
        <div className="w-full flex flex-row justify-start items-start pt-[70px]">
            <div className="flex flex-col w-[19vw] justify-start items-start sticky top-[70px] pl-[70px]">
                <ShoppingCart />
                <div className="w-full flex flex-col justify-start items-start mt-[30px] border-y-[1px] border-sgbodycopy py-[30px]">
                    <NextPrice />
                    <CurrentIndex />
                </div>
                <p className="text-[14px] leading-[18px] mt-[20px]">* The current price / gazer is determined by the sale curve. <a className="underline">read more</a>
                    <br />
                    <br />Next price increase:
                    <br /><span className="font-bold">to 0.132 ETH after 50 gazers are sold</span>
                </p>
            </div>

            <div className="flex flex-col flex-1 justify-start items-start">
                <div className="
                    w-full
                    grid
                    pl-[4.5vw]
                    pr-[6vw]
                    sm:grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-3
                    2xl:grid-cols-4
                    gap-x-[30px]
                    gap-y-[60px]
                    ">
                    {nfts.map((id) => (
                        <NFTCard key={id} id={id} />
                    ))}
                    <br />
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel="next >"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel="< previous"
                        renderOnZeroPageCount={null}
                    />
                </div>
            </div>
        </div>
    )

};