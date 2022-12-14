import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';
import Icons from './Icons';
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const NavbarDropdown = ({linksArr}) =>  {
  console.log("linksArr ---->",linksArr);
  return (
    <Menu as="div" className="w-full relative inline-block text-center">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
          Options
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
        
        <Menu.Items className="w-full absolute z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1 w-full">
          {linksArr.map((linky,i) => {
                return(
                <Menu.Item>
                {({ active }) => (
                  <a
                    href={"/"+linky}
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    {linky}
                  </a>
                )}
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
  const linksArr = ["","mint","lore","proposals","activity"];
  const router = useRouter();
  console.log("router",router);

  return(
    <div className="w-full flex flex-col align-middle fixed font-gatwickbold pt-[32px] bg-[rgba(255,255,255,0.98)]">
    <div className="w-full flex flex-row align-start">
      <div className='flex-1'>
        <div className='hidden sm:block pl-[7vw] mb-6 mt-8'>
          <Icons.Logo2 fill="#3A3C51" />
        </div>
        <div className='block sm:hidden pl-[7vw] mb-6 mt-2'>
          <Icons.Logo3 fill="#3A3C51" />
        </div>
      </div>
      <SkygazersConnector />
    </div>

    <div className='w-full block md:hidden'>
      <NavbarDropdown linksArr={linksArr} />
    </div>

    <div className='w-full hidden md:block'>
    <div className="w-full flex flex-row align-middle  border-gray-200 dark:border-gray-700">
      <div className="flex-1">
        <div className="text-sm font-medium text-center text-gray-500 border-b dark:text-gray-400 pl-[10vw]">
            <ul className="flex flex-wrap mt-[10px]">
              {linksArr.map((linky,i) => {
                return(
                <li className="mr-[50px]">
                    <a
                      href={"/"+linky}
                      className={router.pathname === ("/"+linky)?
                      "text-sgdark inline-block py-4 rounded-t-lg border-b-2 border-sgdark font-gatwickbold text-[14px] uppercase"
                      : "text-sgdark inline-block py-4 rounded-t-lg border-b-2 border-transparent font-gatwickreg text-[14px] uppercase"
                      }>{linky === ""?"home":linky}</a>
                </li>
              )
              })}
            </ul>
        </div>
      </div>
    </div>
    </div>

  </div>
  )
};

export default Navbar;
