import type { NextPage } from 'next';
import Link from 'next/link'
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
import Icons from "components/shared/Icons";


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

    // const [value, setValue] = useState<string>("Click here to add a story");
    // const [oldValue, setOldValue] = useState<string>();
    const [editMode, setEditMode] = useState<boolean>(false);

    const [title, setTitle] = useState<string>("TITLE");
    const [intro, setIntro] = useState<string>("INTRO");
    const [body, setBody] = useState<string>("BODY");

    const { data: session, status } = useSession();

    const imageURL = "/ipfsdata/nft-placeholder.jpeg";

    // useEffect(() => {
    //     const payload = { title, intro, body };
    //     console.log(`Saving value`, payload);
    //     gun.get(`${tokenId}`).put(payload)
    // }, [title, intro, body])

    useEffect(() => {
        gun.get(`${tokenId}`).on(state => {
            console.log(`Received value`, state);
            setTitle(state?.title);
            setIntro(state?.intro);
            setBody(state?.body);
            // if (!state.value) {
            //     setEditMode(true);
            // }
        }, true);
    },[tokenId]);

    const onSave = () => {
        const payload = { title, intro, body };
        console.log(`Saving value for ${tokenId}:`, payload);
        gun.get(`${tokenId}`).put(payload)
        setEditMode(false);
    }

    // full react editor
    return (
        <div className='w-full flex flex-col justify-start items-start pt-[90px]'>
            <Link className='ml-[11vw] mb-[20px]' href="/"><Icons.ArrowLeft /></Link>
            <div className={editMode ? 'border-l-[15px] border-sgbrown w-full flex flex-col justify-start items-start' : 'w-full flex flex-col justify-start items-start'}>
                {editMode ?
                    <div onClick={() => { setEditMode(false) }} className='cursor-pointer fixed flex flex-col justify-start items-start pl-[16px]'>
                        {/* <div className='mb-[10px] w-[20px]'>
                        <Icons.Xmark width="100%" fill="#DDB598" />
                        </div> */}
                        <Icons.Pencil />
                        <p className='font-gatwickbold text-sgbrown mt-[10px] leading-[20px]'>exit</p>

                    </div>
                    : null
                }
                <div className='w-full flex flex-col justify-start items-start pl-[10vw] pr-[4.8vw]'>
                    <div className='w-full flex flex-row '>
                        <div className='flex flex-1 flex-col pr-[100px] justify-start items-start'>
                            {editMode ?
                                <>
                                    <textarea value={title} onChange={(el) => { setTitle(el.target.value) }} id="title" placeholder="title" rows={4} className="appearance-none border border-sgbodycopy w-full py-[20px] px-[30px] uppercase text-sgbodycopy font-gatwickbold text-[2.75rem] leading-[3.25rem] focus:outline-none focus:border-2 focus:border-sgorange2 resize-none mb-[25px]"></textarea>
                                    <textarea value={intro} onChange={(el) => { setIntro(el.target.value) }} id="intro" placeholder="intro" rows={7} className="appearance-none border border-sgbodycopy w-full py-[20px] px-[30px]  text-sgbodycopy font-gatwickreg text-[24px] leading-[38px] focus:outline-none focus:border-2 focus:border-sgorange2 resize-none"></textarea>

                                </>
                                :
                                <>
                                    <h1 className='font-gatwickbold uppercase text-sgbodycopy text-[2.75rem] leading-[3.25rem]'>{title}</h1>

                                    <div className='w-full flex flex-row justify-start items-end mt-[26px] mb-[70px]'>
                                        <div className='w-[20px] h-[20px] rounded-[10px] bg-slate-200 mr-[12px]'></div>
                                        <p className='font-gatwickbold text-[14px] text-sgbodycopy mr-[44px]'>Owned by <a className='underline'>0x874...114</a></p>
                                        <div onClick={() => { setEditMode(true) }} className='flex flex-row justify-start items-end border-b-[3px] border-sgbrown pb-[4px] px-[5px] cursor-pointer'><div className='mb-[6px] mr-[10px]'><Icons.Pencil /></div><p className='font-gatwickbold text-sgbodycopy'>edit mode</p></div>
                                    </div>
                                    <h2 className='font-gatwickreg text-[24px] leading-[38px] text-sgbodycopy'>{intro}</h2>
                                </>
                            }

                        </div>
                        <div className="w-[50%] max-w-[600px] max-h-[600px]">
                            <img
                                // TODO: add loading placeholder picture in /public/ipfsdata
                                src={`${imageURL}`}
                                className="w-full"
                                alt=""
                            />
                        </div>
                    </div>
                    <div className="w-full max-w-[810px] mt-[50px]">
                        {
                            editMode ? (
                                <>
                                    <div data-color-mode="light">
                                        <div className="wmde-markdown-var">
                                            <MDEditor
                                                value={body}
                                                onChange={setBody}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className='lg:pl-[60px] text-sgbodycopy'>
                                        <Markdown
                                            source={body} />
                                    </div>
                                    {/* <PrintPreviewButton id={tokenId} story={value} /> */}
                                </>
                            )
                        }
                    </div>
                </div>
            </div>

            {editMode ?
                <div className='w-full flex flex-col justify-start items-start pt-[70px]'>
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
                        <button className='bigrounded bg-sggreen text-sgbodycopy ml-[11vw]' onClick={() => { onSave() }}>save</button>
                    )}
                    <div className='divider'></div>
                </div>
                :
                null
            }

        </div>
    );
};


export default Skygazer;
