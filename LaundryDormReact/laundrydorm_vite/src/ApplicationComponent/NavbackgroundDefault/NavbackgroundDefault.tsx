//import {Link, Route, Routes } from "react-router-dom";
//Navbar, MobileNav, Button, IconButton,
import {useState} from 'react'
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

export const NavbarDefault = () => {
 
const [nav, setNavBar] = useState(false); //remember that in react, hooks must be called at the top level.
//you cant call them inside loops, conditions, nested function, etc

const Navlinks = [
{id: 1, name: "Sett vask", link:'/setvask'},
{id: 2, name: "Meld feil", link: '/meld-feil'},
{id: 3, name: "Innboks", link: '/innboks'},
{id: 4, name: "Logg inn", link: '/logg-inn'},
{id: 5, name: "Logg ut", link: '/logg-ut'},
{id: 6, name: "Registrer deg", link: '/registrer-deg'},
{id: 7, name: "Om oss", link: '/om-oss'},
{id: 8, name: "Kontakt oss", link: '/kontakt'},
];

const toogleNav = () => setNavBar(!nav);
  return (
    <>
    <div className="sticky top-0 z-50">
    <div className="bg-black flex justify-between items-center mx-auto px-4 text-white">
      {/* Logo */}
      
      <a href="/">
      <h1 className="w-full text-3xl font-bold text-[#60116e]">LaundyDorm</h1>
      </a>

      {/*Desktop Navigation */}
      <ul className="hidden md:flex">
        {Navlinks.map(elements => (
          <li
          key={elements.id}
          className="p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black"
          >
            <a href={elements.link} 
            > 
            {elements.name} </a>
          </li>
        ))}
      </ul>

      {/* Mobile Navigation Icon */}
      <div onClick={toogleNav} className="block md:hidden">
      {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>
    </div>
    </div>
    </>
  );
};
