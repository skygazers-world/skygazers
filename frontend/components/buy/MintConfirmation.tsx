import { useCart, Item } from "react-use-cart";
import { utils, BigNumber } from "ethers";
import { Fragment, useRef, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { getPrices } from "../../utils/cartUtils";
import { useCurveMinterIndex } from "hooks/read/useCurveMinterIndex";
import { useMintNFTs } from "hooks/write/useMintNFTs";
import Icons from "components/shared/Icons";

export const MintConfirmation = ({ onClose }: { onClose: () => void }) => {
    const [open, setOpen] = useState(true)

    const cancelButtonRef = useRef(null)
    const [cartItems, setCartItems] = useState<Item[]>();
    const [NFTIds, setNFTIds] = useState<BigNumber[]>();
    const [cartItemPrices, setCartItemPrices] = useState<BigNumber[]>();
    const [cartTotal, setCartTotal] = useState<BigNumber>(BigNumber.from(0));

    const { data: currentIndex, isLoading, isError } = useCurveMinterIndex();

    const { data: useMintData, isLoading: isMinting, write: mintNFTs } = useMintNFTs(NFTIds, cartTotal);

    const {
        items,
        removeItem,
        emptyCart,
    } = useCart();

    // calculate total price of all NFTs
    useEffect(() => {
        if (items && currentIndex) {
            const { total, itemPrices } = getPrices(currentIndex, items.length);
            setNFTIds(items.map((item) => {
                return BigNumber.from(item.id);
            }));
            setCartItems(items);
            setCartTotal(total);
            setCartItemPrices(itemPrices);
        }
    }, [items, currentIndex]);

    const tx = () => {
        // buy it
        mintNFTs();
        emptyCart();
    }
    console.log('cartItems',cartItems);

    if (isLoading) {
        return (
            <p>Cart loading</p>
        )
    }

    if (isError || !cartItems) {
        return (
            <p>Cart error</p>
        )
    }

    return (
        <Transition.Root show={open} as={Fragment} >
            <Dialog as="div" className="relative z-[9999]" initialFocus={cancelButtonRef} onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div>

                                    <div className="mt-3 text-center sm:mt-5">
                                        <Dialog.Title as="h3" className="text-[16px] font-gatwickreg leading-6 text-sgbodycopy mb-[30px]">
                                            Your cart ({cartItems.length} item{cartItems.length>1?'s':''}):
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <div className="text-sm text-gray-500">
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {cartItems.map((item, i) => (
                                                        <li key={item.id} className="flex flex-col relative mr-[15px] border-b-[4px] border-b-[rgba(255,94,0,0.2)]">
                                                            {item.image?
                                                            <div className="w-full">
                                                                <img className="w-full rounded-[5px]" src={item.image}/>
                                                            </div>
                                                            :null}
                                                            <button onClick={() => removeItem(item.id)} className='bg-white shadow-lg w-[40px] h-[40px] rounded-[20px] flex flex-col justify-center items-center absolute -right-[12px] -top-[12px]'>
                                                                <Icons.Xmark width="40%" fill="#FF5C00" />
                                                            </button>
                                                            <div className="w-full flex mb-[5px] mt-[10px] flex-row px-[4px]">
                                                                <span className="text-sgbodycopy text-[14px] font-gatwickbold  flex-1 text-left">
                                                                {item.name}
                                                                </span>
                                                                <span className="text-sgbodycopy text-[12px] font-gatwickreg">
                                                                {utils.formatEther(cartItemPrices[i])} ETH
                                                                </span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <p className="font-gatwickbold text-[20px] text-sgbodycopy mt-[50px]">Total: {utils.formatEther(cartTotal)} ETH</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-[20px]">
                                    <button
                                        type="button"
                                        className="w-full px-0 middlerounded bg-sggreen text-white"
                                        onClick={() => tx()}
                                    >
                                        {isMinting ? "Minting" : "Mint"}
                                    </button>
                                    <button
                                        type="button"
                                        className="w-full px-0 middlerounded bg-transparent text-sgbodycopy"
                                        onClick={() => onClose()}
                                        ref={cancelButtonRef}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}