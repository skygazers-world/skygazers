import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import CTE from "react-click-to-edit";

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

    const [value, setValue] = useState<string>("The droid ");
    const [editMode, setEditMode] = useState<boolean>(false);

    const imageURL = "/ipfsdata/nft-placeholder.jpeg";




    // full react editor
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <div className="border-solid border-2 w-60 rounded-xl border-slate-500"></div>
                <img
                    // TODO: add loading placeholder picture in /public/ipfsdata
                    src={`${imageURL}`}
                    className="w-full rounded-xl"
                    alt=""
                />
            </div>
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
                            <button className='btn text-white bg-gradient-to-r from-pink-500 to-green-500' onClick={() => { setEditMode(false) }}>Save</button>&nbsp;
                            <button className='btn text-white bg-gradient-to-r from-pink-500 to-violet-500' onClick={() => { setEditMode(false) }}>Cancel</button>

                        </>
                    ) : (
                        <div onClick={() => { setEditMode(true) }}>
                            <Markdown

                                warpperElement={{
                                    "data-color-mode": "light"
                                }}
                                source={value} />
                        </div>
                    )
                }
            </div>
        </div>
    );
};


export default Skygazer;
