import { useEffect } from 'react'
import {NavbarDefault} from "./ApplicationComponent/NavbackgroundDefault/NavbackgroundDefault";
import {BackgroundDefault} from "./ApplicationComponent/BackgroundDefault/BackgroundDefault";
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
    <div> <NavbarDefault /> </div>
    <div> <BackgroundDefault/> </div>
      </>
  )
}

export default App
