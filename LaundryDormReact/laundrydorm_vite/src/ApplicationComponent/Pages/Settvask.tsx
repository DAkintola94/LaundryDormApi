import {NavbarDefault} from "../NavbackgroundDefault/NavbackgroundDefault"
import { FooterDefault } from "../FooterDefault/FooterDefault";
import {useState} from "react"

export const Settvask = () => {

  const [laundry, setLaundry] = useState();

  console.log(laundry, setLaundry);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

  }
  
  
  return (
    <>
    <div className="laundryBG_set">
      <form onSubmit={handleSubmit} className="w-full max-w-lg">

        <div>
          <NavbarDefault />

    <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name" >  </label>

this here

    
    


  






         <FooterDefault />
         
         </div>

      </div>


    </div>

         </form>

     </div>

        
    </>
  )
}
