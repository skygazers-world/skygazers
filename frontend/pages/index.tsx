import type { NextPage } from 'next';
import { MySkygazers } from 'components/home/MySkygazers';
import Navbar from 'components/shared/navbar';

const My: NextPage = () => {
    return (
        <div className='flex flex-col justify-start items-start'>
            <Navbar />
            <MySkygazers />
        </div>
    );
};

export default My;
