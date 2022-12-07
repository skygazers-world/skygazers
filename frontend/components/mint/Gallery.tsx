import { useEffect, useState } from "react";
import { useAccount } from 'wagmi'
import { utils, ethers } from "ethers";
import { useRouter } from 'next/router';
import { NFTCard } from "./NFTCard";
import { Cart } from "./Cart";
import ReactPaginate from 'react-paginate';

import { useNextPrice } from '../../hooks/read/useNextPrice';
import { useNftBalance } from '../../hooks/read/useNftBalance';

const itemsPerPage = 50;

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
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        setItemOffset(newOffset);
    };

    const { address: ownerAddress } = useAccount();
    const [ownerBalanceViz, setOwnerBalanceViz] = useState();
    const [nextPriceViz, setNextPriceViz] = useState();
    const { data: nextPrice } = useNextPrice();
    const { data: ownerBalance } = useNftBalance({ ownerAddress });

    useEffect(() => {
        setNextPriceViz(nextPrice);
    }, [nextPrice]);


    useEffect(() => {
        setOwnerBalanceViz(utils.formatUnits(ownerBalance, "wei"));
    }, [ownerBalance]);

    return (
        <>
            <Cart />
            You have {ownerBalanceViz} items.
            Next price: {nextPriceViz} ETH
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