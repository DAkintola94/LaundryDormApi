import React from 'react'
import {FaUserCircle} from "react-icons/fa";
import Link from 'next/link'


export const ResponsiveMenu = ({ showMenu, navLinks }) => { //receiving the prop 
  return (
    <div
      className={`${
        showMenu ? "left-0" : "-left-[100%]"
      } fixed bottom-0 top-0 z-20 flex h-screen w-[75%]
      flex-col justify-between bg-white dark:bg-black
      dark:text-white px-8 pb-6 pt-16 text-black
      duration-300 md:hidden rounded-r-xl shadow-md`}
    >
            <div>
                {/* user top selection */}
                <div className="flex items-center justify-start 
                gap-3">
                    <FaUserCircle className="text-5xl" />
                    <div>
                        <h1> Velkommen </h1>
                        <h1 className="text-sm text-slate-500"> *navn på innlogget* </h1>
                    </div>
                </div>
                {/* navlinks */}
                <nav className="mt-12">
                    <ul>
                    {navLinks.map(({ id, name, link }) => {  // Using the navLinks prop (correct)
    return (
      <li key={id} className="py-4">
        <Link
          href={link} 
          className={`text-xl font-medium
           text-black dark:text-white py-2 px-4 
           rounded-full hover:bg-[#eed963] 
           duration-300`}
        >
          {name}
        </Link>
      </li>
    );
  })
}
                    </ul>
                </nav>
            </div>
            {/* bottom footer section */}
            <div className="footer bg-white text-black">
                <h1>
                Laget av <a href="https://github.com/dakintola94" target="_blank" rel="noopener noreferrer"> Akin</a>
                </h1>
            </div>
    </div>
    );
}
