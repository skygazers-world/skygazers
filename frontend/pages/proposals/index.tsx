import Navbar from 'components/shared/navbar';
import Generalmsg from 'components/shared/generalmsg';
import Footer from 'components/shared/footer';
import { Proposals } from 'components/proposals/Proposals';

const Proposals_ = () => {
    return (
        <>
            <Navbar />
            <Generalmsg txt="Proposals coming soon.." link="https://skygazers.world/howitworks" linktxt="read more about how it works"/>
            <Footer />
        </>

    );
};

export default Proposals_;
