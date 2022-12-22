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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><path d=%22M225.033 37.5308H214.768C212.535 37.5308 210.402 39.1812 210.402 39.1812H225.033V37.5308Z%22 fill=%22#3A3C51%22></path><path d=%22M206.17 41.987C205.636 41.987 205.136 41.987 204.703 41.921H199.771C200.47 42.9772 202.803 43.6374 206.17 43.6374C217.268 43.6374 223.467 50.7343 223.934 57.6991H200.004V59.3495H225.633V58.5243C225.633 50.5032 218.801 41.987 206.17 41.987Z%22 fill=%22#3A3C51%22></path></svg>" />

      </Head>
      <Navbar />
      <main className="pt-[213px]">
        {children}
      </main>
    </div>

  )
}