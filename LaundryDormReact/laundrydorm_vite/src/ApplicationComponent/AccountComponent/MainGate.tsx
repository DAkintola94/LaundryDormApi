import React from 'react'
import { NavbarDefault } from '../NavbackgroundDefault/NavbackgroundDefault'
import { FooterDefault } from '../FooterDefault/FooterDefault'
import { Register } from './Register'
import { Login } from './Login'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

export const MainGate = () => {
    const location = useLocation();
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
            <FooterDefault 
            />
        </div>
        </div>
  )
}
