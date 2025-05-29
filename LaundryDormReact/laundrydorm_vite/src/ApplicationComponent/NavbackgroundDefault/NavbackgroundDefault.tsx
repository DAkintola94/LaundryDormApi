//import {Link, Route, Routes } from "react-router-dom";
//Navbar, MobileNav, Button, IconButton,
import React from 'react'
import {Typography, MenuHandler, Menu, MenuItem, MenuList} from "@material-tailwind/react";
import { MdLocalLaundryService, MdAccountCircle} from "react-icons/md";
import {IoIosInformationCircle} from "react-icons/io";
import {VscFeedback} from "react-icons/vsc"

export const NavbarDefault = () => {
  const [openNav, setOpenNav] = React.useState(false);
  
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

// ...existing code...
const navList = (
  <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
    <li>
      <Menu>
        <MenuHandler>
          <Typography
            variant="small"
            color="blue-gray"
            className="flex items-center gap-x-2 p-1 font-medium cursor-pointer"
          >
            <MdLocalLaundryService className="text-blue-gray-500 w-5 h-5" />
            <span>Vask</span>
          </Typography>
        </MenuHandler>
        <MenuList>
          <MenuItem><a href="/login">Sett vask</a></MenuItem>
          <MenuItem><a href="/login">Reservasjon</a></MenuItem>
          <MenuItem><a href="/login">Historikk</a></MenuItem>
        </MenuList>
      </Menu>
    </li>
    <li>
      <Menu>
        <MenuHandler>
          <Typography
            variant="small"
            color="blue-gray"
            className="flex items-center gap-x-2 p-1 font-medium"
          >
            <MdAccountCircle className="text-blue-gray-500 w-5 h-5" />
            <span>Konto</span>
          </Typography>
        </MenuHandler>
        <MenuList>
          <MenuItem><a href="/login">Logg inn</a></MenuItem>
          <MenuItem><a href="/login">Logg ut</a></MenuItem>
          <MenuItem><a href="/login">Min side</a></MenuItem>
        </MenuList>
      </Menu>
    </li>
    <li>
      <Typography
        variant="small"
        color="blue-gray"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
        <VscFeedback className="text-blue-gray-500 w-5 h-5" />
        <a href="#" className="flex items-center">Meld feil</a>
      </Typography>
    </li>
    <li>
      <Typography
        variant="small"
        color="blue-gray"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
        <IoIosInformationCircle className="text-blue-gray-500 w-5 h-5" />
        <a href="#" className="flex items-center">Om meg</a>
      </Typography>
    </li>
  </ul>
);


  return (
    <div>Navbar</div>
  )
}
