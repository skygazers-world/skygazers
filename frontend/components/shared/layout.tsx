import { ReactNode } from "react";
import Head from 'next/head';
import { TimeTokenBalance } from './TimeTokenBalance';
import { ConnectButton } from '@rainbow-me/rainbowkit';
// import { createIcon } from 'opepen-standard';

// export const OpepenAvatar: React.FC<{ address: string; size: number }> = ({ address, size }) => {
//   const canvas = createIcon({
//     seed: address,
//     size,
//   });

//   return (
//     <img src={canvas.toDataURL()} alt="Opepen Avatar" />
//   );
// };


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

                  <div className="flex flex-row cursor-pointer items-end text-[12px] border-b border-sgorange2 pl-[30px] pr-[60px] ">
                    <p onClick={openConnectModal} className="pb-[5px] font-gatwickbold uppercase">
                      Connect Wallet
                    </p>
                  </div>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button" className="mr-8">
                    Wrong network
                  </button>
                );
              }
              return (
                <div onClick={openAccountModal} className="flex flex-row cursor-pointer items-end text-[12px] border-b border-[rgba(58,60,81,0.25)] px-[20px] sm:px-[60px]">
                  <p className='pb-[5px] font-gatwickbold'>
                    <TimeTokenBalance />
                  </p>
                    {account.ensAvatar ?
                      <div className='w-9 h-9 bg-slate-700 rounded-[50%] -mb-[6px] mx-[15px]'>
                      <img
                        alt='account.ensAvatar'
                        src={account.ensAvatar}
                      />
                      </div>
                      :
                      <div className="bg-sgbodycopy w-[1px] h-[36px] -mb-[6px] mx-[15px]">
                      </div>
                    }
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
        <div className='w-full flex flex-col justify-start'>
          <div className="w-full flex flex-row justify-start items-end fixed font-gatwickbold bg-[rgba(255,255,255,0.9)] z-[999] pt-8">
            <div className='flex-1'>
            </div>
            <div className='pl-[5vw]'><p className='font-gatwickbold border-[2px] border-gradient-to-r from-[#FFAB7B] to-[#F5BF97] px-3 py-1 mr-8 opacity-50 text-sgbodycopy text-[10px]'>BETA</p></div>

            <SkygazersConnector />
          </div>
        <main>
        {children}
      </main>
      </div>

    </div>

  )
}