import React from 'react'
import { NavbarDefault } from '../NavbackgroundDefault/NavbackgroundDefault'
import { FooterDefault } from '../FooterDefault/FooterDefault'
import { useLocation } from 'react-router-dom'
import { MdError } from 'react-icons/md'
import {useState } from 'react'

export const Error404 = () => {
    const location = useLocation(); //To get value passed from the usenavigate redirection in SettVask.tsx
    const [errorMessage] = useState<string | null>(
        location.state?.errMessage || "An error occured"); //getting the data value from the useNavigate
                                                            //Also, making a value incase errMessage is null

  return (
    <div className="error404Page"> <NavbarDefault/>
    
        <div className="flex items-center justify-center font-bold gap-2 py-8">
            <MdError className="text-1xl"/>
            <span> {errorMessage} </span>
        </div>
    
    <FooterDefault />
    </div>
  )
}
