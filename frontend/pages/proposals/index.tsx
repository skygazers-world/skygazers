import Navbar from 'components/shared/navbar';
import { Proposals } from 'components/proposals/Proposals';

const Proposals_ = () => {
    return (
        <>
            <Navbar />
            <div className="w-full flex flex-col justify-start items-start">
                <Proposals />
            </div >
        </>

    );
};

export default Proposals_;
