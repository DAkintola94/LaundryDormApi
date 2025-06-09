import {NavbarDefault} from "../NavbackgroundDefault/NavbackgroundDefault"
//import { FooterDefault } from "../FooterDefault/FooterDefault"

export const Settvask = () => {
  return (
    <>
    <div> <NavbarDefault /> </div>
    <section className="bg-amber-600"> 
    <div className="container flex justify-end"> 

        
          <input type="date" className="custom-date" placeholder="Date"></input> {/*Since index.css is global, no need to import*/}
        </div>
        <div className="container flex justify-end">
          <input type="date" className={"custom-date"} placeholder="Date">
          </input>
        </div>
        <p>here</p>


    </section>
        {/* <div> <FooterDefault /></div> */ }
    </>
  )
}
