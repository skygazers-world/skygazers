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
        <p>TODO: loading next price</p>
    );

    if (isError) return (
        <p>TODO: Cant get next price</p>
    );

    return (
        <p>
            Price of next NFT: {nextPrice} ETH
        </p>
    );
}

const CurrentIndex = () => {
    const { data, isError, isLoading } = useCurveMinterIndex();
    const [index, setIndex] = useState<number>();
    useEffect(() => setIndex(data), [data]);
    if (isLoading) return (
        <p>TODO: loading current NFT index</p>
    );

    if (isError) return (
        <p>TODO: Cant get current NFT index</p>
    );

    return (
        <p>
            NFT's already minted in this collection: {index}<br />
        </p>
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
        <>
            {/* <ShoppingCart />
            <NextPrice />
            <CurrentIndex /> */}

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

            <div className="
                w-full 
                grid
                sm:grid-cols-2
                md:grid-cols-3
                md:pl-[10vw]
                md:pr-[12vw]
                lg:grid-cols-4
                lg:pl-[10vw]
                lg:pr-[12vw]
                2xl:grid-cols-5
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
        </>
    )

};