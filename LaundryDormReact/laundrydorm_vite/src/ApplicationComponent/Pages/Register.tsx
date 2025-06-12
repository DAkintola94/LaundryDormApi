import React from 'react'
import {MdAccountCircle} from 'react-icons/md'
import {useState} from 'react'
import { NavbarDefault } from "../NavbackgroundDefault/NavbackgroundDefault"
import { FooterDefault } from "../FooterDefault/FooterDefault"



export const Register = () => {

    
    {/*  <MdAccountCircle />      */}

    const [firstName, regFirstName] = useState("");
    const [lastName, regLastName] = useState("");
    const [userName, regUserName] = useState("");
    const[phoneNumber, regPhoneNr] = useState("");
    const [address, regAddress] = useState("");
    const [passWord, regPassword] = useState("");
    const [confirmPassWord, regConfirmPassword] = useState("");
    const [email, regEmail] = useState("");
    const [isPending, setPending] = useState(false);

    //const handleSubmit = (e) => {
        //e.preventdefault();
    //} 


  return (
    <>
    <div className="register_loginBG">
        
    <form onSubmit={handleSubmit}>

    <div className="min-h-screen flex flex-col">
        <NavbarDefault />




    <div className="flex-1 flex flex-col items-center justify-center py-8">
        <label>Brukernavn</label>
        <input type="text" onChange={(evt) => regUserName(evt.target.value)}  placeholder='Brukernavn...' className="text-white mb-4 p-2 border rounded w-full max-w-md" required></input>

        <label>Fornavn</label>
        <input type="text" onChange={(evt) => regFirstName(evt.target.value)} placeholder="Ola..." className="text-white mb-4 p-2 border rounded w-full max-w-md" required></input>

        <label>Etternavn</label>
        <input type="text" onChange={(evt) => regLastName(evt.target.value)} placeholder="Nordman..." className="text-white mb-4 p-2 border rounded w-full max-w-md" required></input>

        <label>Addresse</label>
        <input type="text" onChange={(evt) => regAddress(evt.target.value)} placeholder="addresse" className="text-white mb-4 p-2 border rounded w-full max-w-md" required></input>

        <label>Email</label>
        <input type="email" onChange={(evt) => regEmail(evt.target.value)} placeholder="laundrydorm@live.no" className="text-white mb-4 p-2 border rounded w-full max-w-md" required></input>

          <label>Telefon nr</label>
        <input type="text" onChange={(evt) => regPhoneNr(evt.target.value)} placeholder="+4712345678" className="text-white mb-4 p-2 border rounded w-full max-w-md" required></input>

          <label>Passord</label>
        <input type="password" onChange={(evt) => regPassword(evt.target.value)} placeholder="****" className="text-white mb-4 p-2 border rounded w-full max-w-md" required></input>

          <label>Bekreft passord</label>
        <input type="password" onChange={(evt) => regConfirmPassword(evt.target.value)} placeholder="****" className="text-white mb-4 p-2 border rounded w-full max-w-md" required></input>



        { !isPending && <button type="submit">Registrer</button> }
        
        {isPending && <button disabled type="submit">Registrerer...</button> }
        

    </div>
        <FooterDefault />
    </div>

    </form>

    </div>
    </>
  )
}


