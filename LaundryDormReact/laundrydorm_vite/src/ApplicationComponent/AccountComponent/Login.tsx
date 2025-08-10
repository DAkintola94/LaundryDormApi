import React from 'react'
import {useState} from 'react'
import { NavbarDefault } from '../NavbackgroundDefault/NavbackgroundDefault'
import { FooterDefault } from '../FooterDefault/FooterDefault'
import {MdAlternateEmail} from 'react-icons/md'
import { RiLockPasswordFill } from 'react-icons/ri'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


export const Login = () => {

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
    // Loads VITE_API_BASE_URL from the environment variables based on the current Vite mode.
    // if running in 'docker' mode, it uses variables from `.env.docker`; otherwise, it falls back to .env.local or .env.[mode].

    console.log("Backend API URL, docker mode:", import.meta.env.VITE_API_BASE_URL);
    
    const navigate = useNavigate();

    const [email, usersEmail] = useState('');
    const [passWord, usersPassword] = useState('');
    const [pending, setBtnPending] = useState(false);
    const [errorMsg, setErrorMessage] = useState('');

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const loginData = { //The left side need to match how the model is setup in backend/C#
                                //right side is what we get from our user/usestate
            Email: email,
            Password: passWord
        }
        setBtnPending(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/api/ProfileManagement/LoginAuth`, 
            loginData, //This is the body, axios automatically JSON-stringifies the request body, no need to json.stringify
        {
            headers: {
                "Content-Type": "application/json"
            },
        }) 
            const tokenResponse = response.data //When not getting json in return, only use data, not (dot) + variable name after
            console.log("The token from backend is ", tokenResponse);
            setBtnPending(false);

            localStorage.setItem("access_token", tokenResponse);
            navigate('/',
                {replace: true}
            );
        }

        catch (err: unknown){
            if(axios.isAxiosError(err) && err.response){
                //if server respond with a status code outside of 2xx range
                console.error('Backend respond status: ', err.response.status);
                setErrorMessage(`Error message from backend: ${err.response.data || "Something went wrong"}`);
                setBtnPending(false);
            } else if(axios.isAxiosError(err) && err.request){
                //No response received (e.g., server down)
                console.error("No response from server:", err.request);
                setErrorMessage("No response from the server, try again later");
                setBtnPending(false);
            } else {
                console.error("An unexpected error occured", err);
                setErrorMessage("An unexpected error occured" + err);
                setBtnPending(false);
            }
        }
    }

  return (
    <>
    <div className="register_loginBG">
        <form onSubmit={handleSubmit}>
            <div className="min-h-screen flex flex-col">
                <NavbarDefault/>

                <div className="flex-1 flex flex-col items-center justify-center py-8">
                    <label className="text-white flex items-center gap-2"> Email <MdAlternateEmail /></label>
                    <input type="text" onChange={(e) => usersEmail(e.target.value) } placeholder="abc123@laundrydorm.no" className="text-white mb-4 p-2 border rounded w-full max-w-md"/>
                    {errorMsg &&
                        <span className="text-red-400 mb-4"> {errorMsg}</span>
                    }

                    <label className="text-white flex items-center gap-2"> Passord <RiLockPasswordFill /> </label>
                    <input type="password" onChange={(e) => usersPassword(e.target.value)} placeholder="****" className="text-white mb-4 p-2 border rounded w-full max-w-md" required />

                    {!pending && <button type="submit" className="mb-4 p-2 border rounded w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold">
                         Login 
                         </button>}

                     {pending && 
                        <button disabled className="mb-4 p-2 border rounded w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center">
                            {pending ? (
                                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                            ) : (
                                <span className="w-5 h-5 mr-3" /> // invisible spacer. In other word, we are leaving only "w-5 h-5 mr-3" again, and not rendering the circle/path 
                            )}
                            Henter data
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
