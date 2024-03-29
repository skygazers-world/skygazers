import { NFTCard } from "./NFTCard";
import { ShoppingCart } from "./ShoppingCart";
import { GalleryFilters } from "./GalleryFilters";
import ReactPaginate from 'react-paginate';
import { useNextPrice } from '../../hooks/read/useNextPrice';
import { useCurveMinterIndex } from '../../hooks/read/useCurveMinterIndex';
import { useRemainingAtThisPricePoint } from '../../hooks/read/useRemainingAtThisPricePoint';
import { useEffect, useState } from 'react';
// import { PriceCurve } from "./PriceCurve";
import { useCollectionFilter } from "hooks/useCollectionFilter";
import traitsmap from "../../data/traitsmap.json";
// import Link from 'next/link'

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

// const CurrentIndex = () => {
//     const { data, isError, isLoading } = useCurveMinterIndex();
//     const [index, setIndex] = useState<number>();
//     useEffect(() => setIndex(data), [data]);
//     if (isLoading) return (
//         <div className="flex w-full flex-col justify-start items-start">
//             <p className="text-[10px] md:text-[14px]  leading-[12px]  md:leading-[16px] text-sgbodycopy">gazers sold</p>
//             <p className="font-gatwickbold text-[16px] md:text-[20px] text-sgbodycopy">Loading...</p>
//         </div>
//     );

//     if (isError) return (
//         <div className="flex w-full flex-col justify-start items-start">
//             <p className="text-[10px] md:text-[14px]  leading-[12px]  md:leading-[16px] text-sgbodycopy">gazers sold</p>
//             <p className="font-gatwickbold text-[16px] md:text-[20px] text-sgbodycopy">Can't fetch...</p>
//         </div>
//     );

//     return (
//         <div className="flex w-full flex-col justify-start items-start">
//             <p className="text-[10px] md:text-[14px]  leading-[12px]  md:leading-[16px] text-sgbodycopy">gazers sold</p>
//             <p className="font-gatwickbold text-[16px] md:text-[20px] text-sgbodycopy">{index}</p>
//         </div>
//     );
// }

const Remaining = () => {
    const { data: index, isError, isLoading } = useCurveMinterIndex();
    const { data: remaining } = useRemainingAtThisPricePoint(index);
    // const [showCurve, setShowCurve] = useState(false);
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
            {/* <Link href="https://hackmd.io/bD_1SAoXR0SW_YVzqPOzEQ#NFT-economics" onClick={() => { setShowCurve(true) }} className="text-[14px] leading-[18px] mt-[20px] underline font-light">see full sale curve</Link> */}
            {/* {showCurve && (
                <PriceCurve onClose={() => { setShowCurve(false) }} />
            )} */}
        </div>
    );
}

function getCheckedValues(nestedArray) {
    const result = [];
    let offset = 0;
    for (let i = 0; i < nestedArray.length; i++) {
        const subArray = nestedArray[i];
        const trueIndexes = [];

        for (let j = 0; j < subArray.length; j++) {
            if (subArray[j] === true) {
                trueIndexes.push(j + offset);
            }
        }
        if (trueIndexes.length > 0) {
            result.push(trueIndexes);
        }
        offset += subArray.length;
    }
    return result;
}

//   // Function to get checked values
//   const getCheckedValues = (data) => {
//     const values = [];
//     for (let groupIndex = 0; groupIndex < data.length; groupIndex++) {
//       const groupData = data[groupIndex];
//       const selectedIndexes = [];
//       for (let itemIndex = 0; itemIndex < groupData.items.length; itemIndex++) {
//         if (checkedValues[groupIndex][itemIndex]) {
//           selectedIndexes.push(groupData.items[itemIndex].index);
//         }
//       }
//       values.push(selectedIndexes); // Push the array regardless of its length
//     }
//     console.log(JSON.stringify(values, null, 2));
//     return values;
//   };

function filterNestedArrays(mainArray, filterArray) {
    const resultIndexes = [];

    for (let idx = 0; idx < mainArray.length; idx++) {
        const subArr = mainArray[idx];
        let isMatch = true;

        for (const filterSubArr of filterArray) {
            if (!filterSubArr.some(filterElem => subArr.includes(filterElem))) {
                isMatch = false;
                break;
            }
        }

        if (isMatch) {
            resultIndexes.push(idx);
        }
    }

    return resultIndexes;
}

// baseOffset = what offset in our NFT collection do we start from
// totalItems = total items in this collection
export const Gallery = ({ baseOffset }) => {
    const [pageOffset, setPageOffset] = useState(0);
    const [filteredNFTs, setFilteredNFTs] = useState<number[]>([]);

    // array of traits to filter on
    const filterMask = useCollectionFilter((state) => state.filter);
    // console.log("FilterM",JSON.stringify(filterMask));

    useEffect(() => {

        const filterArray = getCheckedValues(filterMask);

        // console.log();


        // console.log("FM2=", JSON.stringify(filterArray, null, 2))


        // const f = traitsmap.reduce((accum, itemMask, i) => {
        //     // if (filterMask.length == 0 || hasCommonTraits(filterMask, itemMask)) {
        //     accum.push(i);
        //     // }
        //     return accum;
        // }, [])
        // console.log(`There are ${f.length} items with these filters`);
        // // reset pagination too
        const fNFTs = filterNestedArrays(traitsmap, filterArray);
        console.log(`fNFTs ${fNFTs.length}`);
        setFilteredNFTs(fNFTs);
        setPageOffset(0);
    }, [filterMask]);

    
    console.log(`filteredNFTs ${filteredNFTs?.length}`);
    const nfts = filteredNFTs.slice(baseOffset + pageOffset * itemsPerPage, baseOffset + pageOffset * itemsPerPage + itemsPerPage);
    const pageCount = Math.ceil(filteredNFTs.length / itemsPerPage);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        console.log(`Set offset to ${event.selected}`);
        setPageOffset(event.selected);
    };

    return (
        <div className="w-full flex flex-col md:flex-row-reverse justify-start items-start pt-[0px] md:pt-[50px]">
            <div className="flex flex-row md:flex-col w-full md:w-[19vw] md:min-w-[19vw] justify-start items-start sticky top-[62px] md:top-[100px] pl-[30px] md:pl-[0px] pr-[30px] xl:pr-[70px] py-[30px] md:py-[0px] z-10 bg-[rgba(255,255,255,0.9)] md:h-[calc(100vh_-_130px)] overflow-y-auto">
                <ShoppingCart onClose={() => {
                    // refresh this page 
                }} />
                    <GalleryFilters />
                    <div className="w-full hidden md:flex  flex-row md:flex-col justify-start items-start mt-[10px] md:mt-[30px] mb-[0px] md:mb-[0px] border-y-[1px] border-sgbodycopy py-[10px] md:py-[30px]">
                        <NextPrice />
                        <Remaining />
                    </div>
            </div>

            <div className="w-full flex flex-col flex-1 justify-start items-start">
                {/* <div className="block md:hidden">
                    <GalleryFilters />
                </div> */}
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