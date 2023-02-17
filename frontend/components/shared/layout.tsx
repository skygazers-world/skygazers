import { ReactNode } from "react";
import Head from 'next/head';
import { TimeTokenBalance } from './TimeTokenBalance';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const SkygazersConnector = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        // console.log("account in connector====",account);
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }
              return (
                <div onClick={openAccountModal} className="flex flex-row cursor-pointer items-end text-[12px] border-b border-[rgba(58,60,81,0.25)] px-[20px] sm:px-[60px]">
                  <p className='pb-[5px] font-gatwickbold'>
                    <TimeTokenBalance />
                  </p>
                  <div className='w-9 h-9 bg-slate-700 rounded-[50%] -mb-[6px] mx-[15px]'>
                    {account.ensAvatar ?
                      <img
                        alt='account.ensAvatar'
                        src={account.ensAvatar}
                      />
                      : null
                    }
                  </div>
                  <p className='pb-[5px] font-gatwickbold'>
                    {account.displayName}
                  </p>

                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};


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
        <div className='w-full flex flex-col align-start border-1 border-red-500 pb-10'>
          <div className="w-full flex flex-row align-start fixed font-gatwickbold pt-[32px] bg-[rgba(255,255,255,0.8)] z-[999]">
            <div className='flex-1'>
            </div>
            <SkygazersConnector />
          </div>
        <main>
        {children}
      </main>
      </div>

    </div>

  )
}