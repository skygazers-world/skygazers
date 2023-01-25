import { ReactNode } from "react";
import Head from 'next/head';

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
        <main>
        {children}
      </main>
    </div>

  )
}