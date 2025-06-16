import React from 'react'
import {MdAccountCircle, MdAlternateEmail, MdContactPhone} from 'react-icons/md'
import {useState} from 'react'
import { NavbarDefault } from "../NavbackgroundDefault/NavbackgroundDefault"
import { FooterDefault } from "../FooterDefault/FooterDefault"
import { useNavigate } from 'react-router-dom'




export const Register = () => {

    const navigate = useNavigate(); //to navigate 

    {/*  <MdAccountCircle />      */}

    const [firstName, regFirstName] = useState("");
    const [lastName, regLastName] = useState("");
    const [userName, regUserName] = useState("");
    const[phoneNumber, regPhoneNr] = useState("");
    const [address, regAddress] = useState("");
    const [passWord, regPassword] = useState("");
    const [confirmPassWord, regConfirmPassword] = useState("");
    const [email, regEmail] = useState("");
    const [isPending, setBtnPending] = useState(false);
    const [errorMessage, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(passWord !== confirmPassWord){
            setError("Passordene matcher ikke");
            return;
        }

        setBtnPending(true);

        const registerData ={ //The left side need to match how the model is setup in backend/C#
                                //right side is what we get from our user/usestate
            UserAddress: address,
            Email: email,
            Password: passWord,
            ConfirmPassword: confirmPassWord,
            UserName: userName,
            UserFirstName: firstName,
            UserLastName: lastName,
            PhoneNumber: phoneNumber

        };
        
        try {
             const response = await fetch('https://localhost:7054/api/ProfileManagement/RegistrationAuth', { //await when fetching from the url api, the variable name is response
            method: 'POST',
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify(registerData)
        });
            
            if(!response.ok){
                setBtnPending(false);
                return Promise.reject(response);
            }

            const tokenString = await response.text();//data we are getting back from the backend, the return statement from the backend
                                                 //returning what the server send us back, as text since the backend is returning the token as plain string.
                                                 //With login and register, although we are posting, we are also waiting for a token return!


        
            console.log("Datas", tokenString); //data has the data from the backend.
                                                // If we are getting json back, the variable after data. must match the same variable name in the backend, since that is how json work
                                                
            localStorage.setItem("access_token", tokenString);
            console.log("The data & access token", tokenString);

            setBtnPending(false); 

            navigate('/', {replace: true }); //navigate to root after we successfully registered
        }

        catch(err) {
            console.error("An error occured", err);
            setBtnPending(false);
        }

    } 


  return (
    <>
    <div className="register_loginBG"> {/* .register_loginBG is in global css*/}
        
    <form onSubmit={handleSubmit}>

    <div className="min-h-screen flex flex-col">
        <NavbarDefault />


    <div className="flex-1 flex flex-col items-center justify-center py-8">
        <label className="text-white flex items-center gap-2">Brukernavn <MdAccountCircle className='text-white'/></label>
        <input type="text" onChange={(evt) => regUserName(evt.target.value)} placeholder="Brukernavn..." className="text-white mb-4 p-2 border rounded w-full max-w-md" required></input>

        <label className="text-white">Fornavn</label>
        <input type="text" onChange={(evt) => regFirstName(evt.target.value)} placeholder="Ola..." className="text-white mb-4 p-2 border rounded w-full max-w-md" required></input>

        <label className="text-white">Etternavn</label>
        <input type="text" onChange={(evt) => regLastName(evt.target.value)} placeholder="Nordman..." className="text-white mb-4 p-2 border rounded w-full max-w-md" required></input>

        <label className="text-white">Addresse</label>
        <input type="text" onChange={(evt) => regAddress(evt.target.value)} placeholder="stevnavn..." className="text-white mb-4 p-2 border rounded w-full max-w-md" required></input>

        <label className="text-white flex items-center gap-2" >Email <MdAlternateEmail /> </label>
        <input type="email" onChange={(evt) => regEmail(evt.target.value)} placeholder="laundrydorm@live.no" className="text-white mb-4 p-2 border rounded w-full max-w-md" required></input>

          <label className="text-white flex items-center gap-2">Telefon <MdContactPhone /> </label>
        <input type="text" onChange={(evt) => regPhoneNr(evt.target.value)} placeholder="+4712345678" className="text-white mb-4 p-2 border rounded w-full max-w-md" required></input>

          <label className="text-white">Passord</label>
        <input type="password" onChange={(evt) => regPassword(evt.target.value)} placeholder="****" className="text-white mb-4 p-2 border rounded w-full max-w-md" required></input>
        {errorMessage && (
            <span className="text-red-400 mb-4"> {errorMessage}</span>
        )}

          <label className="text-white">Bekreft passord</label>
        <input type="password" onChange={(evt) => regConfirmPassword(evt.target.value)} placeholder="****" className="text-white mb-4 p-2 border rounded w-full max-w-md" required></input>


        { !isPending && <button type="submit" className="mb-4 p-2 border rounded w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold">Registrer</button> }
        
        {isPending && <button disabled type="submit" className="mb-4 p-2 border rounded w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold">Registrerer...</button> }
        

    </div>
        <FooterDefault />
    </div>

    </form>

    </div>
    </>
  )
}


