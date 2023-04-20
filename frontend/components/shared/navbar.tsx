import Link from 'next/link'
import { useRouter } from 'next/router';
import Icons from './Icons';
import { Fragment, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react';
import { useNftBalance } from "../../hooks/read/useNftBalance";
import { useAccount } from 'wagmi'

const NavbarDropdown = ({ linksArr, router }) => {
  const [skygazerBalance, setSkygazerBalance] = useState<String>("");
  const { address: ownerAddress, isConnected } = useAccount();

  const { data, isLoading, isError } = useNftBalance({ ownerAddress });

  useEffect(() => {
    if (data) {
      setSkygazerBalance(data.toString());
    }
  }, [data]);

  return (
    <Menu as="div" className="w-full relative inline-block text-center mt-6">
      <div>
        <Menu.Button className="inline-flex w-full justify-center border-b-[1px] border-gray-300 shadow-sm text-sgorange2 rounded-t-lg font-gatwickbold text-[24px] uppercase">
          {linksArr.map((linky, i) => {
            return (
              <p key={`dropdown-${i}`}
                className={router.pathname === ("/" + linky) ?
                  "text-sgorange2 rounded-t-lg font-gatwickbold text-[20px] uppercase block py-2 cursor-pointer"
                  : "hidden"
                }>{linky === "" ? `my gazers (${skygazerBalance})` : linky}</p>
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

        <Menu.Items className="w-full absolute z-20 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none -mt-[53px]">
          <div className="py-8 w-full">
            {linksArr.map((linky, i) => {
              return (
                <Menu.Item key={`dropdownmenu-${i}`}>
                  <Link
                    href={"/" + linky}
                    className={router.pathname === ("/" + linky) ?
                      "text-sgorange2 rounded-t-lg font-gatwickbold text-[20px] uppercase block py-[5px]"
                      : "text-sgbrown rounded-t-lg font-gatwickbold text-[20px] uppercase block py-[5px]"
                    }>{linky === "" ? `my gazers (${skygazerBalance})` : linky}</Link>
                </Menu.Item>
              )
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}






const Navbar = () => {
  const linksArr = ["", "mint", "lore", "proposals"];
  const router = useRouter();
  const [skygazerBalance, setSkygazerBalance] = useState<String>();
  const { address: ownerAddress, isConnected } = useAccount();

  const { data, isLoading, isError } = useNftBalance({ ownerAddress });

  useEffect(() => {
    if (data) {
      setSkygazerBalance(data.toString());
    }
  }, [data]);

  return (

    <div className='w-full flex flex-col md:flex-row justify-center md:justify-start items-center md:items-end pt-[64px] '>
      <div className='md:pl-[7vw] mt-12 md:mt-0 mb-2'>
        <Icons.Logo fill="#59342B" width='275px' height='175.9px' />
      </div>

      <div className='w-full flex flex-col justify-start items-start'>
        {/* <div className='pl-[5vw]'><p className='font-gatwickbold bg-gradient-to-r from-[#FFAB7B] to-[#F5BF97] px-3 py-1 mb-4 opacity-50 text-sgbodycopy text-[12px]'>BETA</p></div> */}
        <div className='w-full block md:hidden'>
          <NavbarDropdown router={router} linksArr={linksArr} />
        </div>

        <div className='w-full hidden md:flex flex-col justify-start items-start pl-[5vw]'>
          <Link href="/"><p className={router.pathname === "/" ? "text-sgorange2 inline-block rounded-t-lg font-gatwickbold text-[24px] uppercase cursor-pointer"
            : "text-sgbrown inline-block rounded-t-lg font-gatwickbold text-[24px] uppercase cursor-pointer"
          }>{`my gazers (${skygazerBalance})`}</p>
          </Link>
          <ul className="flex text-sm font-medium text-center flex-row align-middle mt-1">
            {linksArr.map((linky, i) => {
              if (linky === "") {
                return null
              }
              return (
                <li key={`link-${i}`} className="mr-[40px]">
                  <Link
                    href={"/" + linky}
                    className={router.pathname === ("/" + linky) ?
                      "text-sgorange2 inline-block rounded-t-lg font-gatwickbold text-[24px] uppercase"
                      : "text-sgbrown inline-block rounded-t-lg font-gatwickbold text-[24px] uppercase"
                    }>{linky}</Link>
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
