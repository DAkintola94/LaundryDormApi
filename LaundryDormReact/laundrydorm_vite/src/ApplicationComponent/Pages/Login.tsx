import React from 'react'
import {useState} from 'react'
import { NavbarDefault } from '../NavbackgroundDefault/NavbackgroundDefault'
import { FooterDefault } from '../FooterDefault/FooterDefault'
import {MdAlternateEmail} from 'react-icons/md'
import { RiLockPasswordFill } from 'react-icons/ri'


export const Login = () => {

    const [email, usersEmail] = useState('');
    const [passWord, usersPassword] = useState('');
    const [pending, setBtnPending] = useState(false);
    const [errorMsg, setErrorMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const loginData = { //The left side need to match how the model is setup in backend/C#
                                //right side is what we get from our user/usestate
            Email: email,
            Password: passWord
        }
        setBtnPending(true);

        fetch('https://localhost:7054/api/ProfileManagement/LoginAuth', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(loginData)
        }).then(response => {
            if(!response.ok) //read Register or report for promises understanding
            {
                setBtnPending(false);
                setErrorMessage("Det oppstod en feil");
                return Promise.reject(response); //this is a special return that exits this .then() and passes the rejection to the next .catch() in the promise chain
            }
            
            return response.json(); //if we dont enter the if statement above, "get" the json the backend sent us as return
                                    //return inside a .then() or .catch() only exits the callback, not the parent function
                                    //in normal methods without js promises, return would exit the entire function immediately

        }).then(data => { //.then now contains whatever our backend sent as JSON response, due to response.json(); above

            console.log("Valid login");   
            
            localStorage.setItem("access_token", data.jwtToken);  //this is the property of the JSON object return by the backend from the return json(); above
                                                                  //the variable name after data. must match what our backend returns. jwtToken in this case
            
            //localStorage is a browser API that is global to your site. Any page or component in your React app can access the token first value
            
            setBtnPending(false);

        }).catch(err => {
            console.log("An error occured", err);
            setErrorMessage("Det oppstod en feil");
            setBtnPending(false);
        })
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
                    <input type="text" onChange={(e) => usersPassword(e.target.value)} placeholder="****" className="text-white mb-4 p-2 border rounded w-full max-w-md" required />

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
