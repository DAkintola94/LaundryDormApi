import React from 'react';
import { NavbarDefault } from '../NavbackgroundDefault/NavbackgroundDefault';
import {FooterDefault} from '../../ApplicationComponent/FooterDefault/FooterDefault';



export const Report = () => {
  return (

    <div className="reportBackgroundImage">

   <div className="min-h-screen flex flex-col">
     <NavbarDefault /> {/* Although we imported, we can still use className in div to structure the look of our component*/}
    
    <div className=" flex-1 flex flex-col items-center justify-center py-8">

        <label className="text-2xl text-white"> Navn </label>
        <input type="text" placeholder="Ditt navn..." className="text-white mb-4 p-2 border rounded w-full max-w-md" />
        
        <label className="text-2xl text-white"> Skriv feilmeldingen...</label>
        <textarea placeholder="..." className="text-white p-2 border rounded w-full max-w-md min-h-[120px]" />

        <label htmlFor="kategori" className=" text-white text-2xl" > Velg kategori </label>

        <select id="kategori"  className="mb-4 p-2 border rounded w-full max-w-md">
            <option value="1"> Forbedring </option>
            <option value="2"> Vedlikehold </option>
            <option value="3"> Feil </option>
            <option value="4"> Annet </option>

            

        </select>

    </div>

     <FooterDefault /> 
     </div>


     </div>
    
  );
}
