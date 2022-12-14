import { useEffect, useState } from "react";
import { useAccount } from 'wagmi'
import { NFTCard } from "./NFTCard";
import { ShoppingCart } from "./ShoppingCart";
import ReactPaginate from 'react-paginate';
import { PriceCurve } from "../shared/PriceCurve";
import { useNextPrice } from '../../hooks/read/useNextPrice';
import { useNftBalance } from '../../hooks/read/useNftBalance';
import { useCurveMinterIndex } from '../../hooks/read/useCurveMinterIndex';

const itemsPerPage = 50;

// baseOffset = what offset in our NFT collection do we start from
// totalItems = total items in this collection
export const Gallery = ({ baseOffset, totalItems }) => {
    const [itemOffset, setItemOffset] = useState(0);
    const [nextPriceViz, setNextPriceViz]: [string, any] = useState();
    const [currentIndexViz, setCurrentIndexViz]: [number, any] = useState();
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

    const { address: ownerAddress } = useAccount();
    const { data: nextPrice } = useNextPrice();
    const { data: ownerBalance } = useNftBalance({ ownerAddress });
    const { data: currentIndex } = useCurveMinterIndex();

    useEffect(()=>{
        currentIndex && setCurrentIndexViz(currentIndex.toNumber())
    },[currentIndex])

    useEffect(() => {
        if (nextPrice) {
            setNextPriceViz(nextPrice.toFixed(3));
        }
    }, [nextPrice]);

    if (!nextPriceViz || !currentIndexViz){
        return null;
    }

    return (
        <>
            <ShoppingCart />

            NFT's already minted in this collection: {currentIndexViz}<br/>
            Price of next NFT: {nextPriceViz} ETH

            {/* <PriceCurve start={currentIndexViz-150} end={currentIndexViz+150} current={currentIndexViz}/> */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {nfts.map((id) => (
                    <div key={id}>
                        <NFTCard id={id} price={nextPriceViz} />
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