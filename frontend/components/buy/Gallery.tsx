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
            <p className="font-gatwickreg text-[14px] leading-[16px] text-sgbodycopy">Current price / NFT</p>
            <p className="font-gatwickbold text-sgbodycopy">{nextPrice} ETH</p>
        </div>
    );
}

const CurrentIndex = () => {
    const { data, isError, isLoading } = useCurveMinterIndex();
    const [index, setIndex] = useState<number>();
    useEffect(() => setIndex(data), [data]);
    if (isLoading) return (
        <p className="font-gatwickbold text-sgbodycopy text-opacity-50">Loading available NFTs...</p>
    );

    if (isError) return (
        <p className="font-gatwickreg text-sgorange2 text-opacity-70">Can't available NFTs...</p>
    );

    return (
        <div className="flex w-full flex-col justify-start items-start">
        <p className="font-gatwickreg text-[14px] text-sgbodycopy">NFTs available at current price</p>
        <p className="font-gatwickbold text-sgbodycopy">{index}</p>
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
        <div className="w-full flex flex-row-reverse justify-start items-start">
            <div className="flex flex-col w-[24vw] justify-start items-start">
                <ShoppingCart />
                <div className="flex fixed flex-col w-[18vw] h-[280px] justify-start items-start border-sgbodycopy border-opacity-10 border-[10px] pt-[40px] pb-[40px] px-[30px] mt-[80px]">
                    <NextPrice />
                    <CurrentIndex />
                </div>
            </div>
            {/* <div className="
                w-full 
                grid
                grid-cols-1
                sm:grid-cols-2
                md:grid-cols-3
                md:pl-[6vw]
                md:pr-[8vw]
                lg:grid-cols-4
                lg:pl-[6vw]
                lg:pr-[8vw]
                2xl:grid-cols-5"> */}
            <div className="flex flex-col flex-1 justify-start items-start">
                <div className="h-[80px]">


                </div>
                <div className="
                    w-full
                    grid
                    pl-[6.9vw]
                    pr-[4.8vw]

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