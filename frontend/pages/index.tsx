import type { NextPage } from 'next';
import Link from 'next/link'
import Head from 'next/head';
import Navbar from 'components/shared/navbar';
import Footer from 'components/shared/footer';

const Home: NextPage = () => {
  return (
    <div className="bg-gradient-to-r from-cyan-400 to-blue-300" data-theme="winter">
      <Head>
        <title>SkyGazers</title>
        <meta
          name="description"
          content="skygazers"
        />
      </Head>

      <Navbar />

      <main>
        <div className="hero min-h-screen -mt-12">
          <div className="hero-content flex-col lg:flex-row">
            <img src="/website_coverimage_V5.c012cf83.png" className="hidden md:block basis-2/5 max-w-sm mr-0 md:mr-20 rounded-lg shadow-2xl"/>
            <div className="basis-3/5">
              <h1 className="text-5xl font-bold text-white">Skygazers</h1>
              <p className="text-xl py-6 text-white">For all of time humans have looked up. But what do they see and what do they imagine?</p>
              <Link href="/mint">
                <span className="btn btn-primary text-white bg-gradient-to-r from-pink-500 to-violet-500">Mint one!</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer/>
    </div>
  );
};

export default Home;
