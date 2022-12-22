import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';
import Icons from './Icons';
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const NavbarDropdown = ({linksArr,router}) =>  {
  return (
    <Menu as="div" className="w-full relative inline-block text-center mt-6">
      <div>
        <Menu.Button className="inline-flex w-full justify-center border-b-[1px] border-gray-300 shadow-sm text-sgorange2 rounded-t-lg font-gatwickbold text-[24px] uppercase">
        {linksArr.map((linky,i) => {
              return(
                <p
                  className={router.pathname === ("/"+linky)?
                  "text-sgorange2 rounded-t-lg font-gatwickbold text-[20px] uppercase block py-2 cursor-pointer"
                  : "hidden"
                  }>{linky === ""? "my collection":linky}</p>
            )
            })}
          {/* <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" /> */}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        
        <Menu.Items className="w-full absolute z-10 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none -mt-[53px]">
          <div className="py-8 w-full">
          {linksArr.map((linky,i) => {
                return(
                <Menu.Item>
                  <Link
                    href={"/"+linky}
                    className={router.pathname === ("/"+linky)?
                    "text-sgorange2 rounded-t-lg font-gatwickbold text-[20px] uppercase block py-[5px]"
                    : "text-sgbrown rounded-t-lg font-gatwickbold text-[20px] uppercase block py-[5px]"
                    }>{linky === ""? "my collection":linky}</Link>
              </Menu.Item>
              )
              })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}







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
        console.log("account in connector====",account);
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
                    <p className='pb-[5px]'>
                    {account.displayBalance
                      ? account.displayBalance
                      : ''}
                    </p>
                    <div className='w-9 h-9 bg-slate-700 rounded-[50%] -mb-[6px] mx-[15px]'>
                    {account.ensAvatar?
                    <img
                      alt='account.ensAvatar'
                      src={account.ensAvatar}
                    />
                    : null
                    }
                    </div>
                    <p className='pb-[5px]'>
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




const Navbar = () => {
  const linksArr = ["","buy","lore","proposals"];
  const router = useRouter();

  return(
    <div className='w-full flex flex-col align-start border-1 border-red-500 pb-10'>
    <div className="w-full flex flex-row align-start fixed font-gatwickbold pt-[32px] bg-[rgba(255,255,255,0.18)]">
      <div className='flex-1'>
      </div>
      <SkygazersConnector />

    

  </div>
    <div className='w-full flex flex-col md:flex-row justify-center md:justify-start items-center md:items-end pt-[64px] '>
      <div className='md:pl-[7vw] mt-12 md:mt-0 mb-2'>
        <Icons.Logo fill="#59342B" width='275px' height='175.9px' />
      </div>
      
      <div className='w-full block md:hidden'>
        <NavbarDropdown router={router} linksArr={linksArr} />
      </div>
  
      <div className='w-full hidden md:flex flex-col align-middle pl-[5vw]'>
        <Link href="/"><p className={router.pathname === "/" ? "text-sgorange2 inline-block rounded-t-lg font-gatwickbold text-[24px] uppercase cursor-pointer"
          : "text-sgbrown inline-block rounded-t-lg font-gatwickbold text-[24px] uppercase cursor-pointer"
          }>My collection</p>
        </Link>
        <ul className="flex text-sm font-medium text-center flex-row align-middle mt-1">
          {linksArr.map((linky,i) => {
            if(linky === "") {
              return null
            }
            return(
              <li className="mr-[40px]">
                  <a
                    href={"/"+linky}
                    className={router.pathname === ("/"+linky)?
                    "text-sgorange2 inline-block rounded-t-lg font-gatwickbold text-[24px] uppercase"
                    : "text-sgbrown inline-block rounded-t-lg font-gatwickbold text-[24px] uppercase"
                    }>{linky}</a>
              </li>
          )
          })}
        </ul>
      </div>
    </div>  
  </div>
  )
};

export default Navbar;
