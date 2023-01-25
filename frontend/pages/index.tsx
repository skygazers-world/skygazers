import type { NextPage } from 'next';
import { MySkygazers } from 'components/home/MySkygazers';
import Navbar from 'components/shared/navbar';

const My: NextPage = () => {
    return (
        <>
                <Navbar />

            <div className='text-center font-bold my-2'>My Skygazers</div>
            <MySkygazers />
        </>
    );
};

export default My;
