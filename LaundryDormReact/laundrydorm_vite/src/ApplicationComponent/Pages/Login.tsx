import React from 'react'
import {useState} from 'react'
import { NavbarDefault } from '../NavbackgroundDefault/NavbackgroundDefault'
import { FooterDefault } from '../FooterDefault/FooterDefault'
import {MdAlternateEmail} from 'react-icons/md'
import { RiLockPasswordFill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'


export const Login = () => {

    const navigate = useNavigate();

    const [email, usersEmail] = useState('');
    const [passWord, usersPassword] = useState('');
    const [pending, setBtnPending] = useState(false);
    const [errorMsg, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginData = { //The left side need to match how the model is setup in backend/C#
                                //right side is what we get from our user/usestate
            Email: email,
            Password: passWord
        }
        setBtnPending(true);

        try {
            const response = await fetch('https://localhost:7054/api/ProfileManagement/LoginAuth', { //await when fetching from the url api, the variable name is response
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(loginData)
        }) 
            if(!response.ok) //read Register or report for promises understanding
            {
                setBtnPending(false);
                setErrorMessage("Det oppstod en feil");
                throw new Error("Login failed"); //Throw makes us go straight to the catch block
            }

            const tokenString = await response.text(); //data we are getting back from the backend
                                                 //returning what the server send us back, in this case we are expecting string
                                                //With login and register, although we are posting, we are also waiting for a token in return!
            
                                         
            console.log("Valid login", tokenString);   
            
            localStorage.setItem("access_token", tokenString);  //tokenString is the response.text we get from the backend
                                                // If we are getting json back, the variable after data. must match the same variable name in the backend, since that is how json work
                                                //localStorage is a browser API that is global to your site. Any page or component in your React app can access the token first value

            console.log("The token is", tokenString);
            
            setBtnPending(false);

            navigate('/', {replace: true}); //navigate to root after we successfully log in

        }

        catch (err){
            console.log("An error occured", err);
            setErrorMessage("Det oppstod en feil");
            setBtnPending(false);
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

                    {
                       pending && <button disabled type="submit" className="mb-4 p-2 border rounded w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold" >
                             Vennligst vent... 
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
