//import {Link, Route, Routes } from "react-router-dom";
//Navbar, MobileNav, Button, IconButton,
//import laundrySVG from "../../assets/BlueLaundry.svg"
import {useState, useRef, useEffect} from 'react'
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import {Link} from "react-router-dom"
import {jwtDecode} from 'jwt-decode';
import { MdAccountCircle, MdPermDeviceInformation } from 'react-icons/md';
import { FaEnvelope } from 'react-icons/fa';
import { GiWashingMachine } from "react-icons/gi";
import { useNavigate } from 'react-router-dom'

export const NavbarDefault = () => {


  const navigate = useNavigate();
 
const [nav, setNavBar] = useState(false); //hooks must be called at the top level in react.
// //you cant call them inside loops, conditions, nested function, etc

 const [dropDownOpen, setDropdownOpen] = useState(false); //dropdown menu for "Vask"
 const [accDownOpen, setAccDropMenu] = useState(false); //dropdown menu for "Account"


 const laundryTimeout = useRef<number | null>(null) //useref is similar to usestate, but useref does not cause re-renders when its value changes
 const accountTimeout = useRef<number | null>(null)


 const handleLaundryMouseEnter = () => {
  if(laundryTimeout.current){
    clearTimeout(laundryTimeout.current);
    laundryTimeout.current = null;
  }
  setDropdownOpen(true);
 }

 const handleLaundryMouseLeave = () => {
  laundryTimeout.current = window.setTimeout(() => setDropdownOpen(false), 100)
 }

 const handleAccountMouseEnter = () => {
  if(accountTimeout.current){
    clearTimeout(accountTimeout.current);
    accountTimeout.current = null;
  }
  setAccDropMenu(true); 
 }

 const handleAccountMouseLeave = () => {
  accountTimeout.current = window.setTimeout(() => setAccDropMenu(false), 100)
 }

  type UserInfo = { //Where we want to hold the information about the logged in user
    email: string; 
    name: string;
    phoneNr: string;
    expireDateTime: number;
    issuer: string;
    audience: string;
  };

  type MyJwtPayload = {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string; //due to how our claim is sending the information from the backend
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone": string; //due to how our claim is sending the information from the backend
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string //due to how our claim is sending the information from the backend
    exp: number; //expire date/time
    iss: string; //issuer
    aud: string;
  }

    const [userInfo, setUsersInfo] = useState<UserInfo | null>(null);

    
    

    useEffect(() => {
      const token = localStorage.getItem("access_token");
      if(token){
        try {
          const decode = jwtDecode<MyJwtPayload>(token);
          setUsersInfo({
            email: decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"], //due to how our claim is sending the information from the backend
            name: decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"], //due to how our claim is sending the information from the backend
            phoneNr: decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone"], //due to how our claim is sending the information from the backend
            expireDateTime: decode.exp,
            issuer: decode.iss,
            audience: decode.aud
          })


        } catch (err){
          console.error("Invalid token",err);
        }

      }

    }, [] );

    console.log("JWT token info",userInfo);


const Navlinks = [
{id: 1, name: "Vask", link:'/vask', icon: <GiWashingMachine />},
{id: 2, name: "Innboks", link: '/innboks', icon:  <FaEnvelope />},
{id: 3, name: "Konto", link: '/account', icon: <MdAccountCircle />},
{id: 4, name: "Om oss", link: '/report', icon: <MdPermDeviceInformation />},
];

const toogleNav = () => setNavBar(!nav);

const laundryDownMenu = [ 
  {name: "Sett vask", link:"/laundry"},
  {name: "Reservasjon", link:"/reservation"},
  {name: "Historikk", link:"/historic"},
];

const accountDropDownMenu = [
{name: "Logg inn", link:"/login"},
{name: "Logg ut", link:"/logout"},
{name: "Registrer deg", link:"/register"}
];


  return (
    <>
    <div className="sticky top-0 z-50">
    <div className="bg-black flex justify-between items-center mx-auto px-2 text-white">
      {/* Logo */}
      
      <Link to="/">
      <h1 className="w-full text-2xl font-bold text-[#c658da] flex items-center"> 
        {/*SVG image for logo if needed <img src={laundrySVG} className="w-8 h-6 ml-2" alt="laundry_svg"/> */}  LaundyDorm </h1>
      </Link>

      {/*Desktop Navigation */}

      <ul className="hidden md:flex">
        {Navlinks.map(elements => ( //map is an array method to loop over an array, and return a new array of elements

        
          <li
          key={elements.id}
          className="relative p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black"
          onMouseEnter={() => {  //eventhandler for mouse even, checks if the mouse is on set id, then perform usestate logic in the function
            if(elements.id === 1) handleLaundryMouseEnter(); 
            if(elements.id === 3) handleAccountMouseEnter();
          }} 
          onMouseLeave={() => { //if dropDown Menu is on, and mouse left it, we set to false
            if(elements.id === 1) handleLaundryMouseLeave(); 
            if(elements.id === 3) handleAccountMouseLeave();
          }} 
          >
            <Link to={elements.link} 
            > 
            {elements.icon} 

            </Link>
            {/* Dropdown for vask*/}
           {elements.id === 1 && dropDownOpen && (
  <ul className="absolute -left-8 top-full mt-2 bg-white text-black rounded shadow-lg min-w-[150px] z-50">
    {laundryDownMenu.map((items, idx) => {
      if(!userInfo && (items.name === "Sett vask" || items.name=== "Reservasjon" || items.name==="Historikk")){
        return null;
      }

        return ( //otherwise, if we dont enter the if statemet due to user logged in, render the rest of the names/link

      <li key={idx} className="px-4 py-2 hover:bg-[#00df9a] hover:text-black">
        <Link to={items.link}>{items.name}</Link>
      </li>
    );
  })}
      
  </ul>
)}
{/* Dropdown for account */}
{elements.id === 3 && accDownOpen && (
  <ul className="absolute -left-8 top-full mt-2 bg-white text-black rounded shadow-lg min-w-[150px] z-50">
    {accountDropDownMenu.map((accList, ids) => {
      // Hide "Logg inn" and "Registrer deg" when logged in

      if (userInfo && (accList.name === "Logg inn" || accList.name === "Registrer deg")) {
        return null;
      }
      // Hide "Logg ut" when NOT logged in
      if (!userInfo && accList.name === "Logg ut") {
        return null;
      }
      // Render "Logg ut" as a button when logged in
      if (accList.name === "Logg ut") {
        return (
          <li key={ids} className="px-4 py-2 hover:bg-[#00df9a] hover:text-black">
            <button
              className="w-full text-left"
              onClick={() => {
                localStorage.removeItem("access_token");
                navigate('/', { replace: true });
              }}
            >
              {accList.name}
            </button>
          </li>
        );
      }
      // Render other menu items as links, except the logout, which is rendered as button
      return (
        <li key={ids} className="px-4 py-2 hover:bg-[#00df9a] hover:text-black">
          <Link to={accList.link}>{accList.name}</Link>
        </li>
      );
    })}
  </ul>
)}


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
