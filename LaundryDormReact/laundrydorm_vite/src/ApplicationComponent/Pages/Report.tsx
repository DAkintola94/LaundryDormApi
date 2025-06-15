import React from 'react';
import {useState} from 'react';
import { NavbarDefault } from '../NavbackgroundDefault/NavbackgroundDefault';
import {FooterDefault} from '../../ApplicationComponent/FooterDefault/FooterDefault';



export const Report = () => {


  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('1'); //needs to be '1' or we keep getting '0' value defaulted
  const [email, setEmail] = useState('');
  const [isPending, setPendingButton] = useState(false);

  const date = new Date().toISOString().split('T')[0];

  

  const handleSubmit = (e) => {
    e.preventDefault();
    const reportData = { //The left side need to match how the model is setup in backend/C#
      AuthorName: name, 
      InformationMessage: message,
      EmailAddress: email,  
      CategoryID: Number(category), //changing the string value into number
      Date: date
    };
    setPendingButton(true)


    fetch('https://localhost:7054/api/Advice/AdviceFetcher', { //part of js promises, fetch this, then do this
      method:'POST',
      headers: {"Content-Type": "application/json" },
      body: JSON.stringify(reportData)
    }).then(() => { //then do this
      console.log("Data was sent successfully");
      setPendingButton(false)
    })
  }
  
  return (
    <div className="reportBackgroundImage"> {/*Since .reportBackgroundImage is in the global index.css, we can import it directly like this*/}

      <form onSubmit={handleSubmit}> 

   <div className="min-h-screen flex flex-col">
     <NavbarDefault /> 
    
    <div className=" flex-1 flex flex-col items-center justify-center py-8">

        <label className="text-2xl text-white"> Navn </label>
        <input type="text" onChange={(e) => setName(e.target.value)} placeholder="Ditt navn..." name="name" className="text-white mb-4 p-2 border rounded w-full max-w-md" required/>

        <label className="text-2xl text-white"> Email </label>
        <input type="email" placeholder="ABC@email.com..." onChange={(e) => setEmail(e.target.value)} name="email" className="text-white mb-4 p-2 border rounded w-full max-w-md" required/>
        
        <label className="text-2xl text-white"> Skriv feilmeldingen...</label>
        <textarea placeholder="..." onChange={(e) => setMessage(e.target.value)} name="message" className="text-white p-2 border rounded w-full max-w-md min-h-[120px]" required/>

        <label htmlFor="kategori"  className=" text-white text-2xl" > Velg kategori </label>

        <select id="kategori" onChange={(e) => setCategory(e.target.value)} name="category" className="mb-4 p-2 border rounded w-full max-w-md bg-white" required>
            <option value="1"> Forbedring </option>
            <option value="2"> Vedlikehold </option>
            <option value="3"> Feil </option>
            <option value="4"> Annet </option>
        </select>

         {!isPending && <button type="submit" 
        className="mb-4 p-2 border rounded w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold">
         Send </button>}
         
         {isPending && <button disabled type="submit" 
        className="mb-4 p-2 border rounded w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold">
         Sender... </button>}

    </div>

     <FooterDefault /> 
     </div>
     </form>
     </div>
    
  );
}
