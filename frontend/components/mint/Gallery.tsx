import { NFTCard } from "./NFTCard";
import { ShoppingCart } from "./ShoppingCart";
import ReactPaginate from 'react-paginate';
import { useNextPrice } from '../../hooks/read/useNextPrice';
import { useCurveMinterIndex } from '../../hooks/read/useCurveMinterIndex';
import { useEffect, useState } from 'react';

const itemsPerPage = 50;

const NextPrice = () => {
    const { data: nextPrice, isError, isLoading } = useNextPrice();

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
    const [index,setIndex] = useState<number>();
    useEffect(()=>{
        setIndex(data);
    },[data]);

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
            <ShoppingCart />
            <NextPrice />
            <CurrentIndex/>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {nfts.map((id) => (
                    <div key={id}>
                        <NFTCard id={id} />
                    </div>
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