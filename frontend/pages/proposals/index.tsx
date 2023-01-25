import Navbar from 'components/shared/navbar';
import { Proposals } from 'components/proposals/Proposals';

const Proposals_ = () => {
    return (
        <>
            <Navbar />
            <div className="">
                <p>Proposals</p>
                <Proposals />
            </div >
        </>

    );
};

export default Proposals_;
