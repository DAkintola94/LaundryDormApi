import { useEffect } from 'react'
import {NavbarDefault} from "./ApplicationComponent/NavbackgroundDefault/NavbackgroundDefault";
import {BackgroundDefault} from "./ApplicationComponent/BackgroundDefault/BackgroundDefault";
import { FooterDefault } from './ApplicationComponent/FooterDefault/FooterDefault';
import './App.css'
import AOS from "aos";
import "aos/dist/aos.css"

function App() {
  
useEffect(() => {
AOS.init({
  offset: 100,
  duration: 600,
  easing: "ease-in-sine",
  delay: 100,
});
AOS.refresh();
}, []);

  return (
    <>
    <div className="min-h-screen flex flex-col"> 
      <NavbarDefault /> 
    <div className="flex-1"> 
      <BackgroundDefault /> 
    </div>
    
    <FooterDefault/>

    </div>
    </>
  )
}

export default App
