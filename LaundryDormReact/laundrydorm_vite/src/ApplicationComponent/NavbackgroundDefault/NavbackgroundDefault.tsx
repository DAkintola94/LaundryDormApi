//import {Link, Route, Routes } from "react-router-dom";
//Navbar, MobileNav, Button, IconButton,
import {useState, useRef} from 'react'
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

export const NavbarDefault = () => {
 
const [nav, setNavBar] = useState(false); //hooks must be called at the top level in react.
// //you cant call them inside loops, conditions, nested function, etc

 const [dropDownOpen, setDropdownOpen] = useState(false); //dropdown menu for "Vask"
 const [accDownOpen, setAccDropMenu] = useState(false); //dropdown menu for "Account"
 const [contactDownOpen, setContactDropMenu] = useState(false); //dropdown menu for "Contact us"

 const laundryTimeout = useRef<number | null>(null) //useref is similar to usestate, but useref does not cause re-renders when its value changes
 const accountTimeout = useRef<number | null>(null)
 const contactTimeout = useRef<number | null>(null)

const handleContactMouseEnter = () => {
  if(contactTimeout.current){ //checking if contactTimeout.current (useref) has any value that is not null || undefined
    clearTimeout(contactTimeout.current); //its to manipulate the onMouseEnter method that is further down, and set a timer to dropdown doesn't disapear fast
    contactTimeout.current = null;
    }
    setContactDropMenu(true); //set to true here so it doesnt skip past it after the if statement.
}

const handleContactMouseLeave = () => {
  contactTimeout.current = window.setTimeout(() => setContactDropMenu(false), 100)
}

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



const Navlinks = [
{id: 1, name: "Vask", link:'/vask'},
{id: 2, name: "Innboks", link: '/innboks'},
{id: 3, name: "Konto", link: '/account'},
{id: 4, name: "Kontakt oss", link: '/contact'},
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
{name: "Registrer deg", link:"register"}
];

const contactUsDropdown = [
{name: "Om oss", link:"/aboutus"},
{name: "Melde feil", link:"/reportproblem"}
];

  return (
    <>
    <div className="sticky top-0 z-50">
    <div className="bg-black flex justify-between items-center mx-auto px-4 text-white">
      {/* Logo */}
      
      <a href="/">
      <h1 className="w-full text-3xl font-bold text-[#c658da]">LaundyDorm</h1>
      </a>

      {/*Desktop Navigation */}

      <ul className="hidden md:flex">
        {Navlinks.map(elements => ( //map is an array method to loop over an array, and return a new array of elements
          <li
          key={elements.id}
          className="relative p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black"
          onMouseEnter={() => {  //eventhandler for mouse even, checks if the mouse is on set id, then perform usestate logic in the function
            if(elements.id === 1) handleLaundryMouseEnter(); 
            if(elements.id === 3) handleAccountMouseEnter();
            if(elements.id=== 4) handleContactMouseEnter();
          }} 
          onMouseLeave={() => { //if dropDown Menu is on, and mouse left it, we set to false
            if(elements.id === 1) handleLaundryMouseLeave(); 
            if(elements.id === 3) handleAccountMouseLeave();
            if(elements.id === 4) handleContactMouseLeave();
          }} 
          >
            <a href={elements.link} 
            > 
            {elements.name} 
            </a>
            {/* Dropdown for vask*/}
            {elements.id === 1 && dropDownOpen && ( //dropDownOpen is the current state of the boolean/default value in the usestate
            <ul className="absolute left-0 top-full mt-2 bg-white text-black rounded shadow-lg min-w-[150px] z-50">
              {laundryDownMenu.map((items, idx) => ( //map is an array method to loop over an array, and return a new array of elements
                <li key={idx} className="px-4 py-2 hover:bg-[#00df9a] hover:text-black"
                >
                  <a href={items.link}> {items.name}</a>
                </li>
              ))}
            </ul>
            )}
              {/* Dropdown for account*/}
              {elements.id === 3 && accDownOpen && (
                <ul className="absolute left-0 top-full mt-2 bg-white text-black rounded shadow-lg min-w-[150px] z-50">
                  {accountDropDownMenu.map((accList, ids) => (
                    <li key={ids} className="px-4 py-2 hover:bg-[#00df9a] hover:text-black">
                      <a href={accList.link}> {accList.name}</a>
                    </li>
                  ))}
                </ul>
              )}
              {/* Dropdown for contact us*/}
              {elements.id === 4 && contactDownOpen &&(
                <ul className="absolute left-0 top-full mt-2 bg-white text-black rounded shadow-lg min-w-[150px] z-50">
                  {contactUsDropdown.map((contactList, idkeys) => (
                    <li key={idkeys} className="px-4 py-2 hover:bg-[#00df9a] hover:text-black">
                      <a href={contactList.link}> {contactList.name}</a>
                    </li>
                  ))}
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
