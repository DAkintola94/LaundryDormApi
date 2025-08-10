import React from 'react'
import {MdAlternateEmail, MdContactPhone, MdOutlineDriveFileRenameOutline} from 'react-icons/md'
import {FaAddressCard} from 'react-icons/fa'
import { TbLockPassword} from 'react-icons/tb'
import {useState} from 'react'
import { NavbarDefault } from "../NavbackgroundDefault/NavbackgroundDefault"
import { FooterDefault } from "../FooterDefault/FooterDefault"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'




export const Register = () => {

    const navigate = useNavigate(); //to navigate to a certain site

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    // Loads VITE_API_BASE_URL from the environment variables based on the current Vite mode.
    // if running in 'docker' mode, it uses variables from `.env.docker`; otherwise, it falls back to .env.local or .env.[mode].

    console.log("Backend API URL, docker mode:", import.meta.env.VITE_API_BASE_URL);


    const [firstName, regFirstName] = useState("");
    const [lastName, regLastName] = useState("");
    const [phoneNumber, regPhoneNr] = useState("");
    const [address, regAddress] = useState("");
    const [passWord, regPassword] = useState("");
    const [confirmPassWord, regConfirmPassword] = useState("");
    const [email, regEmail] = useState("");
    const [isPending, setBtnPending] = useState(false);
    const [errorMessage, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
            UserFirstName: firstName,
            UserLastName: lastName,
            PhoneNumber: phoneNumber

        };
        
        // Debug: Log the data being sent
        console.log("Sending registration data:", registerData);
        
        try {
             const response = await axios.post(`${API_BASE_URL}/api/ProfileManagement/RegistrationAuth`, 
                registerData,
        { 
            headers: {
                "Content-Type": "application/json" 
            },
        })
            const tokenResponse = response.data.jwtToken //Since we are getting json in response
            console.log("Token from the backend is ", tokenResponse);
            setBtnPending(false);

            localStorage.setItem("access_token", tokenResponse);
            navigate('/',
                {
                    replace: true
                }

            );
        }
        catch(err: unknown) {
            if(axios.isAxiosError(err) && err.response){
              //if server respond with a status code outside of 2xx range
                console.error('Backend respond status: ', err.response.status);
                setError(`Error message from backend: ${err.response.data || "Something went wrong"}`);
                setBtnPending(false);
            } else if(axios.isAxiosError(err) && err.request){
                //No response received (e.g., server down)
                console.error("No response from server:", err.request);
                setError("No response from the server, try again later");
                setBtnPending(false);
            } else {
                 console.error("An unexpected error occured", err);
                setError("An unexpected error occured" + err);
                setBtnPending(false);
            }
        }

    } 


  return (
    <>
    <div className="register_loginBG"> {/* .register_loginBG is in global css*/}
        
    <form onSubmit={handleSubmit}>

    <div className="min-h-screen flex flex-col">
        <NavbarDefault />


    <div className="flex-1 flex flex-col items-center justify-center py-8">
        
        <label className="text-white flex items-center gap-2">Fornavn <MdOutlineDriveFileRenameOutline /> </label>
        <input type="text" onChange={(evt) => regFirstName(evt.target.value)} placeholder="Ola..." className="text-white mb-4 p-2 border rounded w-full max-w-md" required></input>

        <label className="text-white flex items-center gap-2">Etternavn <MdOutlineDriveFileRenameOutline /> </label>
        <input type="text" onChange={(evt) => regLastName(evt.target.value)} placeholder="Nordman..." className="text-white mb-4 p-2 border rounded w-full max-w-md" required></input>

        <label className="text-white flex items-center gap-2">Addresse <FaAddressCard />  </label>
        <input type="text" onChange={(evt) => regAddress(evt.target.value)} placeholder="stevnavn..." className="text-white mb-4 p-2 border rounded w-full max-w-md" required></input>

        <label className="text-white flex items-center gap-2" >Email <MdAlternateEmail /> </label>
        <input type="email" onChange={(evt) => regEmail(evt.target.value)} placeholder="laundrydorm@live.no" className="text-white mb-4 p-2 border rounded w-full max-w-md" required></input>

          <label className="text-white flex items-center gap-2">Telefon <MdContactPhone /> </label>
        <input type="text" onChange={(evt) => regPhoneNr(evt.target.value)} placeholder="+4712345678" className="text-white mb-4 p-2 border rounded w-full max-w-md" maxLength={8} required></input>

          <label className="text-white flex items-center gap-2">Passord <TbLockPassword />   </label>
        <input type="password" onChange={(evt) => regPassword(evt.target.value)} placeholder="****" className="text-white mb-4 p-2 border rounded w-full max-w-md" required></input>
        {errorMessage && (
            <span className="text-red-400 mb-4"> {errorMessage}</span>
        )}

          <label className="text-white flex items-center gap-2">Bekreft passord <TbLockPassword />   </label>
        <input type="password" onChange={(evt) => regConfirmPassword(evt.target.value)} placeholder="****" className="text-white mb-4 p-2 border rounded w-full max-w-md" required></input>


        { !isPending && <button type="submit" className="mb-4 p-2 border rounded w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold">Registrer</button> }
        
        {isPending && 
        <button disabled className="mb-4 p-2 border rounded w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center">
            {isPending ? (
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
            ) : (
                <span className="w-5 h-5 mr-3" /> // invisible spacer. In other word, we are leaving only "w-5 h-5 mr-3" again, and not rendering the circle/path 
            )}
                Vennligst vent
            </button>
        }
        

    </div>
        <FooterDefault />
    </div>

    </form>

    </div>
    </>
  )
}


