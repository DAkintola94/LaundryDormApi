import {NavbarDefault} from "../NavbackgroundDefault/NavbackgroundDefault"
//import { FooterDefault } from "../FooterDefault/FooterDefault"

export const Settvask = () => {
  return (
    <>
    <div> <NavbarDefault /> </div>

    <h1 className="text-3xl text-[#00000]" > Sett vask  </h1>

    <div className="container py-5 d-flex">         
          <input type="date" className="custom-date" placeholder="Date"></input> {/*Since index.css is global, no need to import*/}
    </div>

    <div className="container py-5 d-flex">
          <input type="date" className={"custom-date"} placeholder="Date"> </input>
    </div>

    <div className="container py-5 d-flex">
      

    </div>

        <p>here</p>

        {/* <div> <FooterDefault /></div> */ }
    </>
  )
}
