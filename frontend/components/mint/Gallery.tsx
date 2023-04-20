import { NFTCard } from "./NFTCard";
import { ShoppingCart } from "./ShoppingCart";
import ReactPaginate from 'react-paginate';
import { useNextPrice } from '../../hooks/read/useNextPrice';
import { useCurveMinterIndex } from '../../hooks/read/useCurveMinterIndex';
import { useRemainingAtThisPricePoint } from '../../hooks/read/useRemainingAtThisPricePoint';
import { useEffect, useState } from 'react';
import { PriceCurve } from "./PriceCurve";

const itemsPerPage = 50;

const NextPrice = () => {
    const { data, isError, isLoading } = useNextPrice();
    const [nextPrice, setNextPrice] = useState<number>();
    useEffect(() => setNextPrice(data), [data]);
    if (isLoading) return (
        <>
            <div className="flex w-full flex-col justify-start items-start md:mb-[14px]">
                <p className="text-[10px] md:text-[14px]  leading-[12px]  md:leading-[16px] text-sgbodycopy">current price / gazer *</p>
                <p className="font-gatwickbold text-[16px] md:text-[20px] text-sgbodycopy">Loading...</p>
            </div>
        </>
    );

    if (isError) return (
        <>
            <div className="flex w-full flex-col justify-start items-start md:mb-[14px]">
                <p className="text-[10px] md:text-[14px]  leading-[12px]  md:leading-[16px] text-sgbodycopy">current price / gazer *</p>
                <p className="font-gatwickbold text-[16px] md:text-[20px] text-sgbodycopy">Can't fetch current price...</p>
            </div>
        </>
    );

    return (
        <div className="flex w-full flex-col justify-start items-start md:mb-[14px]">
            <p className="text-[10px] md:text-[14px]  leading-[12px]  md:leading-[16px] text-sgbodycopy">current price / gazer *</p>
            <p className="font-gatwickbold text-[16px] md:text-[20px] text-sgbodycopy">{nextPrice} ETH</p>
        </div>
    );
}

const CurrentIndex = () => {
    const { data, isError, isLoading } = useCurveMinterIndex();
    const [index, setIndex] = useState<number>();
    useEffect(() => setIndex(data), [data]);
    if (isLoading) return (
        <div className="flex w-full flex-col justify-start items-start">
            <p className="text-[10px] md:text-[14px]  leading-[12px]  md:leading-[16px] text-sgbodycopy">gazers sold</p>
            <p className="font-gatwickbold text-[16px] md:text-[20px] text-sgbodycopy">Loading...</p>
        </div>
    );

    if (isError) return (
        <div className="flex w-full flex-col justify-start items-start">
            <p className="text-[10px] md:text-[14px]  leading-[12px]  md:leading-[16px] text-sgbodycopy">gazers sold</p>
            <p className="font-gatwickbold text-[16px] md:text-[20px] text-sgbodycopy">Can't fetch...</p>
        </div>
    );

    return (
        <div className="flex w-full flex-col justify-start items-start">
            <p className="text-[10px] md:text-[14px]  leading-[12px]  md:leading-[16px] text-sgbodycopy">gazers sold</p>
            <p className="font-gatwickbold text-[16px] md:text-[20px] text-sgbodycopy">{index}</p>
        </div>
    );
}

const Remaining = () => {
    const { data: index, isError, isLoading } = useCurveMinterIndex();
    const { data: remaining } = useRemainingAtThisPricePoint(index);
    const [showCurve, setShowCurve] = useState(false);

    return (
        <>
            <p className="hidden md:block text-[14px] leading-[18px] mt-[20px] font-bold">* {remaining} gazers left at current price</p>
            <a onClick={() => { setShowCurve(true) }} className="hidden md:block text-[14px] leading-[18px] mt-[8px] underline font-light">show full sale curve</a>
            {showCurve && (
                <PriceCurve onClose={() => { setShowCurve(false) }} />
            )}
        </>
    )
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
        <div className="w-full flex flex-col md:flex-row-reverse justify-start items-start pt-[30px] md:pt-[70px]">
            <div className="flex flex-col w-full md:w-[19vw] justify-start items-start sticky top-[62px] md:top-[100px] pl-[50px] md:pl-[0px] pt-[30px] md:pt-[0px] pr-[50px] md:pr-[70px] z-10 bg-[rgba(255,255,255,0.9)]">
                <ShoppingCart />
                <div className="w-full flex flex-row md:flex-col justify-start items-start mt-[10px] md:mt-[30px] mb-[0px] md:mb-[0px] border-y-[1px] border-sgbodycopy py-[10px] md:py-[30px]">
                    <NextPrice />
                    <CurrentIndex />
                </div>
                <Remaining />
            </div>

            <div className="flex flex-col flex-1 justify-start items-start">
                <div className="
                    w-full
                    grid
                    pl-[6vw]
                    pr-[4.5vw]
                    sm:grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-3
                    2xl:grid-cols-3
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