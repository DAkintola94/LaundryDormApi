import React from 'react'
import { NavbarDefault } from '../NavbackgroundDefault/NavbackgroundDefault'
import { FooterDefault } from '../FooterDefault/FooterDefault'
import { Register } from './Register'
import { Login } from './Login'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FcIdea } from 'react-icons/fc'

export const MainGate = () => {
    const location = useLocation();
    const token = localStorage.getItem("access_token");
    const [isRegister, setRegisterVisible] = useState(location.state?.isRegister ?? true);

    const handleToggle = () => {
        setRegisterVisible(!isRegister)
        console.log(isRegister, "is the value of the boolean");
    }
  return (
        <div className="register_loginBG"> {/* .register_loginBG is in global css*/}   
        <NavbarDefault 
        isRegister={isRegister} 
        onNavigateToAuth={handleToggle} 
        />

         {!token? (<div>

            <div className="min-h-screen flex flex-col">
                {isRegister? (
                    <Register hideFooter={true} hideNavbar={true}
                    />
                ) : (
                    <Login hideFooter={true} hideNavbar={true}
                    />
                )
                }
            <button 
            className="absolute p-2 bg-blue-600 text-white hover:bg-blue-700 z-50 top-4 right-4 rounded"
            color="red" 
            title="Register or login" 
            onClick={handleToggle}>
              {isRegister? "Har du bruker? Logg inn" : "Registrer deg"}
            </button>
        </div>

        </div>) : <div className="flex items-center justify-center text-white mt-5 font-bold gap-2">
        <FcIdea className="text-2xl" />
        <span className="text-yellow-200" > Obs, du er allerede innlogget</span>
        </div>
    }
            <FooterDefault 
            />
        </div>
  )
}
