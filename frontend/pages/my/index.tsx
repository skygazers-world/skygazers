import type { NextPage } from 'next';
import { MySkygazers } from 'components/my/MySkygazers';

const My: NextPage = () => {
    return (
        <>
            <div className='text-center font-bold my-2'>My Skygazers</div>
            <MySkygazers />
        </>
    );
};

export default My;
