import type { NextPage } from 'next';
import Navbar from 'components/shared/navbar';
import Link from "next/link";


function FAQItem ({Q,A, id}) {
    return (
        <div id={id} className="flex flex-col items-start justify-start pt-10 border-t-[1px] mt-10">
            <p className="font-bold text-[18px] ml-4">{Q?Q:null}</p>
            <p className='mt-[10px] ml-4'>{A?A:null}</p>
        </div>
    )
}

const FAQ: NextPage = () => {
    const items = [
        {
            Q: "What is the STT and how does it work?",
            A: "Skygazers Timetokens (STT) is earned by owning a Skygazers-NFT, at a ratio of 1 STT per second you own 1 Skygazers-NFT. If you own f.e. 1 Skygazers-NFT for 2min35sec, then you have 155 STT. If you own 4 Skygazers-NFTs for 1hr00min00sec: you then own 14400 STT, etc. STT therefore expresses how many NFTs you've owned for how long, and will be used in the workings of the Skygazers-DAO.",
            id: "whatisSTT"
        },

        {
            Q: "How can I participate in the Skygazers-DAO, creating and/or voting on proposals?",
            A: "Owning STT will make you a member of the Skygazers-DAO, allowing you to create proposals and participating in votes.",
            id: "howparticipateinDAO"
        },

        {
            Q: "Why are the filters (on the mint-page) using numbers instead of using a name/description? ",
            A: "By not giving the filters a name/description, you refrain from giving them any content of meaning, thus leaving it open in an absolute manner for the community to design the content. It is important to deliberately create a vacuum, a void to be filled when the mechanics of Skygazers are at work."
        },
    ];
    return (
        <>
            <Navbar />
            <div className='w-full flex flex-col items-start justify-start px-[10vw] py-[12vh]'>
                <div className='text-sgbodycopy  max-w-[750px] mb-8'>
                    <p className='font-gatwickreg text-[24px] leading-[38px]'>Skygazers is an experiment of scifi-fantasy world-building through collaboration.</p>
                    <p className='mt-[20px]'>Due to the nature of experimentation, a lot of questions arise. In the following section the most frequently asked questions are collected to serve as a source of knowledge for whoever wants to know more about or interact with the Skygazers app. <br /><br />Didn't find what you were looking for? Reach out to our <Link href="https://discord.gg/jQbMvzbV" className='underline'>Discord server</Link></p>
                </div>
                <div className='max-w-[750px]'>
                    {items.map((item,i) =>{return(
                        <FAQItem key={i} Q={item.Q} A={item.A} id={item.id}/>
                    )})}
                </div>
            </div>
        </>
    );
};

export default FAQ;
