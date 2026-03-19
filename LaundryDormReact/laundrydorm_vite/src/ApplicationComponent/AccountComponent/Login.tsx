import React from 'react'
import {useState, useRef} from 'react'
import { NavbarDefault } from '../NavbackgroundDefault/NavbackgroundDefault'
import { FooterDefault } from '../FooterDefault/FooterDefault'
import {MdAlternateEmail} from 'react-icons/md'
import { RiLockPasswordFill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { loginCall } from "../../lib/authCall" //importing the function so we can use it here
import { responseProps } from '../../lib/authCall' //importing the datatype


export const Login = ({hideNavbar = false, hideFooter = false} : {hideNavbar? : boolean, hideFooter?: boolean}) => {
    
    const navigate = useNavigate();

    const [email, usersEmail] = useState('');
    const [passWord, usersPassword] = useState('');
    const [pending, setBtnPending] = useState(false);
    const [errorMsg, setErrorMessage] = useState('');
    const [countError, setErrorCount] = useState(Number);
    const errorCountRef = useRef(1);
    
    
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setBtnPending(true);

        const formData = new FormData();

        formData.append("Email", email);
        formData.append("Password", passWord);

        const responseData: responseProps = await loginCall(formData);
        console.log(responseData)

        if(responseData.success === false && responseData.errorObject.message === "Request failed with status code 401"){
            setBtnPending(false);
            return
        }

        if(responseData.success === false){
            setBtnPending(false);
            setErrorCount(errorCountRef.current++);

            console.log(countError, ": is the amount of error");

             if (responseData.errorObject){
                setErrorMessage(responseData.errorObject.message);
                return
            } 
             else if(responseData.errorMessage){
                setErrorMessage(responseData.errorMessage ?? "");
                return
            }

            setErrorMessage(responseData.errorMessage ?? "An error occured");
            setBtnPending(false);

            return;
        }

        setBtnPending(false);
        navigate('/', {replace: true});
        
    }

  return (
    <>
    <div className="register_loginBG">
        <form onSubmit={handleSubmit}>
            <div className="min-h-screen flex flex-col">
                {!hideNavbar && <NavbarDefault  />}
                <div className="flex-1 flex flex-col items-center justify-center py-8">
                    <label className="text-white flex items-center gap-2"> Email <MdAlternateEmail /></label>
                    <input type="text" onChange={(e) => usersEmail(e.target.value) } placeholder="abc123@laundrydorm.no" className="text-white mb-4 p-2 border rounded w-full max-w-md"/>

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

                        {errorMsg &&
                        <span className="text-white"> {errorMsg}</span>
                    }

                    { countError > 2 && 
                        <span className="text-white"> Azure "cold start" kan skape problemer av og til, prøv igjen. </span>
                    }

                </div>


                <FooterDefault />
            </div>

        </form>

    </div>
    {!hideFooter && <FooterDefault />}
    </>
    
  )
}
