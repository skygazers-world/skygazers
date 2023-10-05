// import Image from 'next/image'
import styles from '../../styles/Home.module.css';
import Link from "next/link";
import Icons from './Icons';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';


const Footer = () => {
  const router = useRouter();
  const linksArr = ["home", "mint", "lore", "proposals"];
  return (
    <div className="mt-24 w-full flex flex-col lg:flex-row justify-center lg:justify-start items-center lg:items-end bg-gradient-to-b from-[#DEAF8B] to-[#BF9380] pt-20 pb-24 px-16 lg:px-16">
      <div className="w-[240px] lg:w-[160px]">
        <Link href="/">
          <Icons.Logo fill="white" width="100%" height="141.68" />
        </Link>
      </div>
      <ul className="flex flex-col items-start justify-start pb-2">
            {linksArr.map((linky, i) => {
              return (
                <li key={`link-${i}`} className="ml-[40px]">
                      <Link
                      href={"/" + linky}
                      className={router.pathname === ("/" + linky) ?
                        "text-sgbodycopy uppercase font-gatwickbold py-3 text-[12px]"
                        : "text-white uppercase font-gatwickreg py-3 text-[12px]"
                      }>
                        
                        {linky = ""? 'home': linky}
                        
                        
                        </Link>
                </li>
              )
            })}
          </ul>
    </div>
    ) 
}

export default Footer;
