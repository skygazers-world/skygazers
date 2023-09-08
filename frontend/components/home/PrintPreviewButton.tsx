// import { useSession } from "next-auth/react";
import { Fragment, useRef, useState } from 'react'
import Gun from 'gun/gun'
// import { randomBytes } from 'crypto';
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, PrinterIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
// import { useRouter } from 'next/router';
import { useIpfsWrite } from '../../hooks/write/useIpfsWrite';
import { FC } from 'react';

const gun = Gun(process.env.NEXT_PUBLIC_GUNDB_URL);

interface MkPayloadReturnType {
    tokenid: string; // Replace with the actual type
    title: string;   // Replace with the actual type
    intro: string;   // Replace with the actual type
    body: string;    // Replace with the actual type
  }
  
  type MkPayloadFunction = () => MkPayloadReturnType;
  
  interface PrintPreviewButtonProps {
    id: string; // Replace with the actual type of `tokenId`
    getpayload: MkPayloadFunction;
  }

export const PrintPreviewButton : FC<PrintPreviewButtonProps>= ({ getpayload }) => {
    // const { data: session } = useSession();
    // const router = useRouter();
    const [printPreviewID, setPrintPreviewID] = useState<string>();
    const [open, setOpen] = useState(false);

    const { write } = useIpfsWrite();
    const cancelButtonRef = useRef(null)

    const makePrintPreview = async () => {
        const payload = getpayload() as Story;
        console.log(`Saving payload`, payload);
        write(JSON.stringify(payload)).then((cid) => {
            console.log(`CID`, cid);
            const key = cid;
            console.log("saving", payload, "as", key);
            gun.get(`${key}`).put(payload);
            setPrintPreviewID(key);
            setOpen(true);
        });
    }

    // if (!session) {
    //     return null;
    // }

    const origin =
        typeof window !== "undefined" && window.location.origin
            ? window.location.origin
            : "";

    const printPreviewPopup =
        (
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
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
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                            <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-5">
                                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                                Print preview ready!
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <div className="text-sm text-gray-500">

                                                    Share this link with your frens<br />
                                                    <Link href={`/print-preview/${printPreviewID}`}>{`${origin}/print-preview/${printPreviewID}`}</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-1 sm:gap-3">
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                                            onClick={() => {
                                                setPrintPreviewID(null);
                                                setOpen(false);
                                            }}
                                            ref={cancelButtonRef}
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

        );

    return (
        <>
            {printPreviewPopup}
            <button
                type="button"
                className="mt-3 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                onClick={() => {
                    makePrintPreview()
                }}
            >
                <PrinterIcon className="h-6 w-6" aria-hidden="true" />
                Create Print Preview
            </button>
        </>
    )
}