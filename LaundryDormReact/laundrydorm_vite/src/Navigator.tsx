import React, { useState } from 'react'
import { NavbarDefault } from './ApplicationComponent/NavbackgroundDefault/NavbackgroundDefault'
import { FooterDefault } from './ApplicationComponent/FooterDefault/FooterDefault'
import { Settvask } from './ApplicationComponent/LaundryPages/Settvask'
import { Sidebar } from './ApplicationComponent/Pages/Sidebar'

export const Navigator = () => {
    //const [calenderMode, setCalenderMode] = useState(false);
  return (
       <main className="h-screen w-screen flex flex-row relative">
            <div className="h-full transition-all duration-500 w-[55%]">
                <Settvask />
            </div>

            <div className={`h-full flex justify-center bg-secondary z-999 border transition-all duration-500 w-[100%] `}>
                 <Sidebar  />
            </div>


                <FooterDefault 
                />
    </main>
  )
}
