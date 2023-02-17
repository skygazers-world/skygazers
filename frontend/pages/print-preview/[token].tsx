import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import Gun from 'gun/gun'

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

const PrintPreview = () => {

    const router = useRouter()
    const tokenId = router.query.token;

    const [story, setStory] = useState<Story>();

    const imageURL = "/ipfsdata/nft-placeholder.jpeg";

    useEffect(() => {
        if (tokenId) {
            console.log("Token is ", tokenId);
            // TODO : create fallback on IPFS if this value is not found in gunDB
            gun.get(`${tokenId}`).on(data => {
                console.log(`Received value:`, data);
                setStory(data);
            }, true);
        }
    }, [tokenId]);

    if (!story) {
        return (<div>zo ne loader met van die schuivende degradees - die u doen denken dat er hier sebiet ne knaller van ne story komt</div>)
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
                <h1>THIS IS A PRINT PREVIEW</h1>
                <hr />

                <>
                    <Markdown
                        warpperElement={{
                            "data-color-mode": "light"
                        }}
                        source={story.title} />
                </>
                <>
                    <Markdown
                        warpperElement={{
                            "data-color-mode": "light"
                        }}
                        source={story.intro} />
                </>
                <>
                    <Markdown
                        warpperElement={{
                            "data-color-mode": "light"
                        }}
                        source={story.body} />
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
