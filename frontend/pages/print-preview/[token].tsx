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

const gun = Gun('http://localhost:8765/gun')

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

const PrintPreview = () => {

    const router = useRouter()
    const tokenId = router.query.token as string ? router.query.token as string : "notSet"

    const [story, setStory] = useState<string>("??");

    const imageURL = "/ipfsdata/nft-placeholder.jpeg";

    useEffect(() => {
        console.log("Token is ",tokenId);
        gun.get(`${tokenId}`).on(state => {
            console.log(`Received value ${state}`, state);
            setStory(state.story);
        }, true);
    }, [tokenId]);





    // full react editor
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
                <h1>THIS IS A PRINT PREVIEW</h1>
                <hr/>
                
                <>
                    <Markdown
                        warpperElement={{
                            "data-color-mode": "light"
                        }}
                        source={story} />
                </>
                
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


export default PrintPreview;
