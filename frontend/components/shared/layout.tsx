import { ReactNode } from "react";
import Head from 'next/head';
import Navbar from 'components/shared/navbar';
import Footer from 'components/shared/footer';

export default function Layout ({children
}: {
    children: ReactNode;
  }) {
    return (
        <div className="w-full relative">
        <Head>
          <title>SkyGazers</title>
          <meta
            name="description"
            content="skygazers"
          />
        </Head>
        <Navbar />
        <main>
        {children}
        </main> 
    </div>
       
       )
}