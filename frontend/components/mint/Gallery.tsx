import { NFTCard } from "./NFTCard";
import { ShoppingCart } from "./ShoppingCart";
import { GalleryFilters } from "./GalleryFilters";
import ReactPaginate from 'react-paginate';
import { useNextPrice } from '../../hooks/read/useNextPrice';
import { useCurveMinterIndex } from '../../hooks/read/useCurveMinterIndex';
import { useRemainingAtThisPricePoint } from '../../hooks/read/useRemainingAtThisPricePoint';
import { useEffect, useState } from 'react';
import { PriceCurve } from "./PriceCurve";
import { useCollectionFilter, hasCommonTraits } from "hooks/useCollectionFilter";
import traitsmap from "../../data/traitsmap.json";

const itemsPerPage = 15;

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
    if (isLoading) return (
        <div className="flex w-full flex-col justify-start items-start">
            <p className="text-[10px] md:text-[14px]  leading-[12px]  md:leading-[16px] text-sgbodycopy">gazers left at current price</p>
            <p className="font-gatwickbold text-[16px] md:text-[20px] text-sgbodycopy">Loading...</p>
        </div>
    );

    if (isError) return (
        <div className="flex w-full flex-col justify-start items-start">
            <p className="text-[10px] md:text-[14px]  leading-[12px]  md:leading-[16px] text-sgbodycopy">gazers left at current price</p>
            <p className="font-gatwickbold text-[16px] md:text-[20px] text-sgbodycopy">Can't fetch...</p>
        </div>
    );

    return (
        <div className="flex w-full flex-col justify-start items-start">
            <p className="text-[10px] md:text-[14px]  leading-[12px]  md:leading-[16px] text-sgbodycopy">gazers left at current price</p>
            <p className="font-gatwickbold text-[16px] md:text-[20px] text-sgbodycopy">{remaining}</p>
            <a onClick={() => { setShowCurve(true) }} className="text-[14px] leading-[18px] mt-[20px] underline font-light">show full sale curve</a>
            {showCurve && (
                <PriceCurve onClose={() => { setShowCurve(false) }} />
            )}
        </div>
    );
}


// baseOffset = what offset in our NFT collection do we start from
// totalItems = total items in this collection
export const Gallery = ({ baseOffset, totalItems }) => {
    const [pageOffset, setPageOffset] = useState(0);
    const [filteredNFTs, setFilteredNFTs] = useState<number[]>([]);

    const endOffset = pageOffset * itemsPerPage + itemsPerPage;

    // array of traits to filter on
    const filterMask = useCollectionFilter((state) => state.filter);

    useEffect(() => {

        const f = traitsmap.reduce((accum, itemMask, i) => {
            if (filterMask.length == 0 || hasCommonTraits(filterMask, itemMask)) {
                accum.push(i);
            }
            return accum;
        }, [])
        console.log(`There are ${f.length} items with these filters`);
        // reset pagination too
        setFilteredNFTs(f);
        setPageOffset(0);
    }, [filterMask]);

    // let nfts = [];
    // for (let i = baseOffset + pageOffset * itemsPerPage ; i < baseOffset + endOffset; i++) {

    //     nfts.push(i);
    // }
    // const pageCount = Math.ceil(totalItems / itemsPerPage);

    let nfts = filteredNFTs.slice(baseOffset + pageOffset * itemsPerPage, itemsPerPage);
    const pageCount = Math.ceil(filteredNFTs.length / itemsPerPage);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        // const newOffset = (event.selected * itemsPerPage) % totalItems;
        setPageOffset(event.selected);
    };

    return (
        <div className="w-full flex flex-col md:flex-row-reverse justify-start items-start pt-[0px] md:pt-[50px]">
            <div className="flex flex-col w-full md:w-[19vw] justify-start items-start sticky top-[62px] md:top-[100px] pl-[50px] md:pl-[0px] pt-[30px] md:pt-[0px] pr-[50px] md:pr-[70px] z-10 bg-[rgba(255,255,255,0.9)] md:h-[calc(100vh_-_130px)] overflow-y-auto">
                <ShoppingCart />
                <GalleryFilters />
                <div className="w-full flex flex-row md:flex-col justify-start items-start mt-[10px] md:mt-[30px] mb-[0px] md:mb-[0px] border-y-[1px] border-sgbodycopy py-[10px] md:py-[30px]">
                    <NextPrice />
                    <Remaining />
                </div>
            </div>

            <div className="w-full flex flex-col flex-1 justify-start items-start">
                <div className="block md:hidden">
                    <GalleryFilters />
                </div>
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
                        <NFTCard key={id} id={`${id}`} />
                    ))}
                    <br />



                </div>
                <div className="w-full max-w-[90vw] flex flex-row items-center justify-start">
                    <ReactPaginate
                        activeClassName={'item active '}
                        breakClassName={'item break-me '}
                        breakLabel="..."
                        containerClassName={'pagination'}
                        disabledClassName={'disabled-page'}
                        nextClassName={"item next "}
                        forcePage={pageOffset}
                        nextLabel=">"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={2}
                        marginPagesDisplayed={2}
                        pageCount={pageCount}
                        pageClassName={'item pagination-page '}

                        previousLabel="<"
                        previousClassName={"item previous"}

                        renderOnZeroPageCount={null}
                    />
                </div>

            </div>
        </div>
    )

};