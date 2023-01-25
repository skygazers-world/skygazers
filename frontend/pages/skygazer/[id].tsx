import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import Gun from 'gun/gun'
import { AuthStatus } from 'components/home/AuthStatus';
import { Authenticate } from 'components/home/Authenticate';
import { useSession } from "next-auth/react";
import { PrintPreviewButton } from 'components/home/PrintPreviewButton';

const gun = Gun(process.env.NEXT_PUBLIC_GUNDB_URL)

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor").then((mod) => mod.default),
    { ssr: false }
);
const EditerMarkdown = dynamic(
    () =>
        import("@uiw/react-md-editor").then((mod) => {
            return mod.default.Markdown;
        }),
    { ssr: false }
);
const Markdown = dynamic(
    () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
    { ssr: false }
);

const Skygazer = () => {

    const router = useRouter()
    const tokenId = router.query.id as string ? router.query.id as string : "notSet"

    const [value, setValue] = useState<string>("Click here to add a story");
    const [oldValue, setOldValue] = useState<string>();
    const [editMode, setEditMode] = useState<boolean>(false);

    const { data: session, status } = useSession();

    const imageURL = "/ipfsdata/nft-placeholder.jpeg";

    useEffect(() => {
        if (oldValue && oldValue !== value) {
            console.log(`Saving value`);
            gun.get(`${tokenId}`).put({ value })
        }
    }, [value])

    useEffect(() => {
        gun.get(`${tokenId}`).on(state => {
            console.log(`Received value ${state.value}`, state.value);
            setValue(state.value);
            setOldValue(state.value);
            if (!state.value) {
                setEditMode(true);
            }
        }, true);
    });





    // full react editor
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
                {
                    editMode ? (
                        <>
                            <div data-color-mode="light">
                                <div className="wmde-markdown-var">
                                    <MDEditor
                                        value={value}
                                        onChange={setValue}
                                    />
                                </div>
                            </div>

                            {!session && (
                                <>
                                    <span>
                                        <Authenticate />
                                        <br />
                                        You need to be authenticated to be able to save your story
                                    </span>
                                </>
                            )}

                            {session?.user && (
                                <button className='btn text-white bg-gradient-to-r from-pink-500 to-green-500' onClick={() => { setEditMode(false) }}>Save</button>
                            )}


                            <button className='btn text-white bg-gradient-to-r from-pink-500 to-violet-500' onClick={() => { setEditMode(false) }}>Cancel</button>

                            <AuthStatus />

                        </>
                    ) : (
                        <>
                            <div onClick={() => { setEditMode(true) }}>
                                <Markdown

                                    warpperElement={{
                                        "data-color-mode": "light"
                                    }}
                                    source={value} />
                            </div>
                            <PrintPreviewButton id={tokenId} story={value} />
                        </>
                    )
                }
            </div>
            <div>
                <div className="border-solid border-2 w-60 rounded-xl border-slate-500"></div>
                <img
                    // TODO: add loading placeholder picture in /public/ipfsdata
                    src={`${imageURL}`}
                    className="w-full rounded-xl"
                    alt=""
                />
            </div>
        </div>
    );
};


export default Skygazer;
