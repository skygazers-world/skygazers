import { ReactNode } from "react";
import Head from 'next/head';
import Navbar from 'components/shared/navbar';

export default function Layout({ children
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
      <main className="pt-[213px]">
        {children}
      </main>
    </div>

  )
}