import {NavbarDefault} from "../NavbackgroundDefault/NavbackgroundDefault"
import { FooterDefault } from "../FooterDefault/FooterDefault"

export const Settvask = () => {
  return (
    
    <div className="min-h-screen flex flex-col"> 
      <NavbarDefault /> 

        
          <input type="date" className="custom-date" placeholder="Date"></input> {/*Since index.css is global, no need to import*/}
        
        <div className="container flex justify-end">
          <input type="date" className={"custom-date"} placeholder="Date">
          </input>
        </div>
        <p>here</p>

        <FooterDefault />
        
        </div>

    
  )
}
