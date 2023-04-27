import Navbar from 'components/shared/navbar';
import Generalmsg from 'components/shared/generalmsg';
import Footer from 'components/shared/footer';


const Lore = () => {
    return (
        <>
            <Navbar />
            <Generalmsg txt="Lore coming soon.." link="https://skygazers.world/howitworks#lore" linktxt="read more about Lore"/>
            <Footer />
        </>
    );
};

export default Lore;
