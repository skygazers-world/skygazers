import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';

const Navbar = () => {
  const linksArr = ["","mint"];
  const router = useRouter();
  console.log("router",router);

  return(
  <div className="w-full flex flex-row align-middle fixed font-gatwickbold">
    <div className="flex-1">
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
          <ul className="flex flex-wrap mt-[10px]">
            {linksArr.map((linky,i) => {
              return(
              <li className="mr-2">
                  <a
                    href={"/"+linky}
                    className={router.pathname === ("/"+linky)?
                    "text-sgdark inline-block p-4 rounded-t-lg border-b-2 border-sgdark font-gatwickbold text-[14px] uppercase"
                    : "text-sgdark inline-block p-4 rounded-t-lg border-b-2 border-transparent font-gatwickreg text-[14px] uppercase"
                    }>{linky === ""?"home":linky}</a>
              </li>
            )
            })}
          </ul>
      </div>
    </div>
    <div className="">
      <ConnectButton />
    </div>

  </div>
  )
};

export default Navbar;
