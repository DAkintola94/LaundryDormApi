//import {Link, Route, Routes } from "react-router-dom";
//Navbar, MobileNav, Button, IconButton,
//import laundrySVG from "../../assets/BlueLaundry.svg"
import {useState, useRef, useEffect} from 'react'
import {Link} from "react-router-dom"
import {jwtDecode} from 'jwt-decode';
import { MdAccountCircle, MdPermDeviceInformation } from 'react-icons/md';
import { FaEnvelope } from 'react-icons/fa';
import { GiWashingMachine } from "react-icons/gi";
import { useNavigate, useLocation } from 'react-router-dom'
import {Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid';



export const NavbarDefault = () => {

const location = useLocation(); //useLocation gives you information about where the user currently is in your app.
const navigate = useNavigate();
 
const [nav, setNavBar] = useState(false); //hooks must be called at the top level in react.
// //you cant call them inside loops, conditions, nested function, etc

 const [dropDownOpen, setDropdownOpen] = useState(false); //dropdown menu for "Vask"
 const [accDownOpen, setAccDropMenu] = useState(false); //dropdown menu for "Account"
 const [profileImageDropDown, setProfileImageDropDown] = useState(false);


 const laundryTimeout = useRef<number | null>(null) //useref is similar to usestate, but useref does not cause re-renders when its value changes
 const accountTimeout = useRef<number | null>(null) //Setting number if there is a int value, and null if nothing have been set
 const profileImageTimeout = useRef<number | null>(null);


 const handleLaundryMouseEnter = () => {
  if(laundryTimeout.current){ 
    clearTimeout(laundryTimeout.current); //Clear (reset) the timeout number when user enter with their mouse
    laundryTimeout.current = null; //Set the value to null
  }
  setDropdownOpen(true); //Setting dropdown to true
 }

 const handleLaundryMouseLeave = () => { //Adding delay befor closing the dropdown, to prevent it from disappearing instantly
  laundryTimeout.current = window.setTimeout(() => setDropdownOpen(false), 100)
 }

 const handleProfileImageMouseEnter = () => {
  if(profileImageTimeout.current){
    clearTimeout(profileImageTimeout.current);
    profileImageTimeout.current = null;
  }
 }

 const handleProfileImageMouseLeave = () => {
  profileImageTimeout.current = window.setTimeout(() => setProfileImageDropDown(false), 100)
 }

 const handleAccountMouseEnter = () => {
  if(accountTimeout.current){ 
    clearTimeout(accountTimeout.current); //Clear (reset) the timeout number when user enter with their mouse
    accountTimeout.current = null; //Set the value to null
  }
  setAccDropMenu(true); //Setting dropdown to true
 }

 const handleAccountMouseLeave = () => { //Adding delay befor closing the dropdown, to prevent it from disappearing instantly
  accountTimeout.current = window.setTimeout(() => setAccDropMenu(false), 100)
 }

  type UserInfo = { //Where we want to hold the information about the logged in user
    email: string; 
    name: string;
    phoneNr: string;
    expireDateTime: number;
    issuer: string;
    audience: string;
    imageUrl: string;
  };

  type MyJwtPayload = {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string; //due to how our claim is sending the information from the backend
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone": string; //due to how our claim is sending the information from the backend
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string //due to how our claim is sending the information from the backend
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/uri": string;
    exp: number; //expire date/time
    iss: string; //issuer
    aud: string;
  }

    const [userInfo, setUsersInfo] = useState<UserInfo | null>(null); //using it to set or get value from the UserInfo object


    useEffect(() => {
      const token = localStorage.getItem("access_token");
      if(token){
        try {
          const decode = jwtDecode<MyJwtPayload>(token); //important section, as you decoded JWT here and store it in localstorage which is global
          setUsersInfo({
            email: decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"], //due to how our claim is sending the information from the backend
            name: decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"], //due to how our claim is sending the information from the backend
            phoneNr: decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone"], //due to how our claim is sending the information from the backend
            imageUrl: decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/uri"], //Image url path where the backend serves the image
            expireDateTime: decode.exp,
            issuer: decode.iss,
            audience: decode.aud
          })

          //localStorage.setItem("decodedPayload", JSON.stringify(userInfo)); //using JSON.stringify to serialize the objects before storing them
                                                                          //Use JSON.Parse if you want to convert it back to its original object form
        } catch (err){
          console.error("Invalid token",err);
        }

      }

    }, [] );

    console.log(userInfo?.imageUrl);
    

    if(userInfo?.expireDateTime){
      const currentTime = Date.now() / 1000; //Current time in seconds
    }

    console.log("JWT token info",userInfo);


const Navlinks = [
{id: 1, name: "Vask", link:'/vask', icon: <GiWashingMachine />},
{id: 2, name: "Innboks", link: '/innboks', icon:  <FaEnvelope />},
{id: 3, name: "Konto", link: '/account', icon: <MdAccountCircle />},
{id: 4, name: "Om oss", link: '/report', icon: <MdPermDeviceInformation />},
];

const toogleNav = () => setNavBar(!nav);

const laundryDownMenu = [ 
  {name: "Bok vask", link:"/vask"},
  {name: "Historikk", link:"/historic"},
  {name: "Reservasjon", link:"/statusnreservation"}
];

const accountDropDownMenu = [
{name: "Logg inn", link:"/login"},
{name: "Logg ut", link:"/logout"},
{name: "Registrer deg", link:"/register"}
];


  return (
    <>
    <div className="sticky top-0 z-50">
    <div className="bg-black flex items-center mx-auto px-2 text-white">
      {/* Logo */}
      
      <Link to="/">
      <h1 className="text-2xl font-bold text-[#c658da] flex items-center"> 
        {/*SVG image for logo if needed <img src={laundrySVG} className="w-8 h-6 ml-2" alt="laundry_svg"/> */}  LaundyDorm </h1>
      </Link>

      {/*Desktop Navigation */}

      <ul className="hidden md:flex flex-1 justify-center ">
        {Navlinks.map(elements => {
          if(userInfo && elements.name === "Konto"){ //remove the entire account icon if user is logged in
            return null;
          }
        return ( //map is an array method to loop over an array, and return a new array of elements
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
      if(!userInfo && (items.name==="Historikk" || items.name==="Reservasjon" ||items.name==="Bok vask")){
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
                localStorage.removeItem("access_token"); //removes all info about user, global
                
                navigate('/', { replace: true }); //navigate back to homepage
                if(location.pathname === '/'){
                  window.location.reload(); //refresh the page if we are in homepage
                                            //useful to refresh users information on screen
                }
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
);
})}
</ul>
      {
      userInfo && ( 
      <Menu as="div" className="flex-none w-10 h-10 rounded-full hidden md:block">
        <MenuButton className="">
        <img
      src={userInfo?.imageUrl}
      alt=""
      className="flex-none w-10 h-10 rounded-full hidden md:block relative"
      />
        </MenuButton>
        <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg outline-black/5 transition 
        data-close:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in
        "
        >
          
        <div className="py-1">
          <MenuItem>
            <Link 
            to="/account" 
            className="block w-full px-4 py-2 text-left text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
              Min profil
              </Link>
            </MenuItem>
            <MenuItem>
            <button 
            className="block w-full px-4 py-2 text-left text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
            type="button"
            onClick={() => {  
              localStorage.removeItem("access_token"); //Remove all info and token of the user from the global local storage
              navigate('/', {replace:true});
              if(location.pathname==='/'){
                window.location.reload(); //refresh the page if we are in homepage
                                          //useful to refresh the users information on the homepage
              }
            }}    
            >
            Logg ut
            </button>
            </MenuItem>
        </div>
        </MenuItems>
      </Menu>
      )
      }

    </div>
    </div>
    </>
  );
};

