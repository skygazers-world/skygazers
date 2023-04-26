
const Generalmsg = ({txt, link, linktxt}) => {
    return (
        <div className="w-full h-[52vh] md:h-[60vh] flex flex-col justify-center items-center md:py-[3vh] px-[4vw]">
            <div className="w-full h-[full] md:h-[60vh] flex flex-col justify-center items-center bg-sgbrown bg-opacity-10">
                <p className="italic text-opacity-50 mb-[10px]">{txt}</p>
                {link !== "" &&
                    <a className=" underline text-sgorange2" href={link} target="_blank" rel="noopener noreferrer">{linktxt}</a>
                }
            </div>
        </div >
    );
};

export default Generalmsg;