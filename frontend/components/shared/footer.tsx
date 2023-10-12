// import Image from 'next/image'
import styles from '../../styles/Home.module.css';
import Link from "next/link";
import Icons from './Icons';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';


const Footer = () => {
  const router = useRouter();
  const linksArr = ["", "mint", "FAQ",];
  const linksArr2 = ["lore", "proposals"];
  return (
    <div className="mt-24 w-full flex flex-col lg:flex-row justify-center lg:justify-start items-center lg:items-end bg-gradient-to-b from-[#deaf8b51] to-[#bf93806f] pt-14 pb-24 px-16 lg:px-20">
      <div className="w-[240px] lg:w-[160px]">
        <Link href="/">
          <Icons.Logo fill="#59342B" width="100%" height="141.68" />
        </Link>
      </div>
      <div className="grid grid-cols-2 pb-2 gap-0 ml-[60px]">
            <div className='flex flex-col items-start justify-start'>
            {linksArr.map((linky, i) => {
              return (
                <Link
                  key={`link-${i}`}
                  href={"/" + linky}
                  className={router.pathname === ("/" + linky) ?
                    "text-sgorange2 uppercase font-gatwickbold py-1 text-[16px]"
                    : "text-sgbodycopy uppercase font-gatwickbold py-1 text-[16px]"
                  }
                  >
                    {linky === ""? "home": linky}
                </Link>
              )
            })}
            </div>
            <div className='flex flex-col items-start justify-start'>
            {linksArr2.map((linky, i) => {
              return (
                <p
                  key={`link-${i}`}
                  className="text-sgbodycopy uppercase font-gatwickbold py-1 text-[16px] opacity-30">
                    {linky}
                </p>
              )
            })}
            </div>
          </div>
    </div>
    ) 
}

export default Footer;
