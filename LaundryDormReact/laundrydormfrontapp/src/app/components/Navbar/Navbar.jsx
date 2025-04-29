import Link from 'next/link'
import React from 'react'
import { DarkMode } from '../DarkMode';
import { HiMenuAlt3, HiMenuAlt1 } from 'react-icons/hi';
import { ResponsiveMenu } from '../ResponsiveMenu';


const Navlinks = [
{id: 1, name: "Meld feil", link: '/meld-feil'},
{id: 2, name: "Innboks", link: '/innboks'},
{id: 3, name: "Logg inn", link: '/logg-inn'},
{id: 4, name: "Logg ut", link: '/logg-ut'},
{id: 5, name: "Registrer deg", link: '/registrer-deg'},
{id: 6, name: "Om oss", link: '/om-oss'},
{id: 7, name: "Kontakt oss", link: '/kontakt'},
]


export const Navbar = () => {

const [showMenu, setShowMenu] = React.useState(false);
const toggleMenu = () => {
  setShowMenu(!showMenu);
};

  return (<nav className="relative z-10 shadow-md w-full
   dark:bg-black dark:text-white duration-300">
    <div className="container py-2 md:py-0 "> 
        <div className="flex items-center justify-between">
           {/* Logo */}
            <Link href="/" className="text-3xl font-bold">
            <span className="text-[#eed963]"> Laundry</span>
            <span className="he">Dorm</span>
            </Link>
            {/* Hamburger menu */}
            <div className="hidden md:block">
            <ul className="flex items-center gap-6">
              {Navlinks.map(({ id, name, link}) => {
                return (
                  <li key={id} className="py-4">
                  <Link href={link} className={` text-lg font-medium text-black
                     dark:text-white 
                     py-2 px-4 rounded-full hover:bg-[#eed963] dration-300`}>
                  {name}
                  </Link>
                  </li>
                )
              })}
              {  /* DarkMode feature */}
              <DarkMode/>
            </ul>
            </div>

            {/* Mobile menu section */}
            <div className="md:hidden flex items-center
             gap-4">
            <DarkMode />
              {showMenu ? (
                  <HiMenuAlt1 
                  onClick={toggleMenu}
                  className="cursor-pointer 
                  transition-all" size={30}
                  />
                ) : (
                  <HiMenuAlt3 
                  onClick={toggleMenu}
                  className="cursor-pointer transition-all"
                  size={30}
                  />
                )}
            </div>
        </div>
    </div>
    <ResponsiveMenu showMenu={showMenu} navLinks={Navlinks}/> 
  </nav>
  );
};
