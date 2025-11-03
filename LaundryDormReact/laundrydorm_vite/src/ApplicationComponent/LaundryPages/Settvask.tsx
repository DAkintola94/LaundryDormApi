// ...existing code...
import { NavbarDefault } from "../NavbackgroundDefault/NavbackgroundDefault"
import { FooterDefault } from "../FooterDefault/FooterDefault";
import videoBg from "../../assets/soapvideo.mp4"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { MdError } from "react-icons/md";
import axios from "axios";

export const Settvask = () => {
  const navigate = useNavigate();

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
    // Loads VITE_API_BASE_URL from the environment variables based on the current Vite mode.
    // if running in 'docker' mode, it uses variables from `.env.docker`; otherwise, it falls back to .env.local or .env.[mode].

    console.log("Backend API URL, docker mode:", import.meta.env.VITE_API_BASE_URL);

  const [pending, setPending] = useState(false);
  const [formMessage, setFormMessage] = useState('')
  const [formEmail, setFormEmail] = useState('');
  const [formName, setFormName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMsg, setError] = useState('');
  // const [sessionId, setSessionId] = useState<number | null>(null); not needed currently, since we are returning backendSessionId directly from data

  const [machineId, setMachineId] = useState('1'); //value for the machine id, default value need to be 1 so it doesn't become 0
  const [laundryTime, setLaundryTime] = useState('1'); //need a default value so it doesn't auto set the option value to 0

  const token = localStorage.getItem("access_token");
  
  console.log(phoneNumber);

  useEffect(() => {
    const fetchSetUsersInfo = async () => {
      await axios.get(`${API_BASE_URL}/api/ProfileManagement/AuthenticateUser`,
      {
        headers: {"Authorization" : `Bearer ${token}`}
      })
      .then(response => {
        setFormName(response.data.userName);
        setFormEmail(response.data.email);
        setPhoneNumber(response.data.phoneNumber);
      })
    }
    if(token)
    {
      fetchSetUsersInfo();
    }
    else {
      console.log("No user is currently signed in");
    }
  }, [token, API_BASE_URL]) //with the array as second argument means this effect will only run once


  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);

    const laundrySessionData = { //variable name on the left, that gets value from the right, needs to match our variable model name in c sharp
      userMessage: formMessage,
      
      machineId: Number(machineId), //converting to Number

      sessionTimePeriodId: Number(laundryTime), //its for the time period the user want to set their laundry, backend

      reservationTime: new Date().toISOString(), //reservation time/date. .NET handles the convertion automatically 

    }; 

    if (!token) {
      setPending(false);
      console.warn("No token found. User might not be logged in.");
      setError("Vennligst, logg inn for å bruke denne tjenesten");
      return;
    }

    try{
          const postElement = await axios.post(`${API_BASE_URL}/api/Laundry/StartSession`,
       laundrySessionData, //This is the body, Axios automatically JSON-stringifies the request body, no need to json.stringify
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${token}`
        },
      })
        const responseData = postElement.data.backendSessionId; //backend is sending back that variable name
        console.log(responseData);

        navigate('/success', {
        replace: true, //prevent user from going back
        state: {
          ID: responseData, //Value we want to pass to the redirected page
        }
    });
    setPending(false);
    } 
    catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        // If server responded with a status code outside the 2xx range

        console.error('Backend error: ', err.response.status);
        setError(`Error: ${err.response.data || "something went wrong"}`);
        setPending(false);

      } else if (axios.isAxiosError(err) && err.request) {
        // No response received (e.g., server down)
        console.error('No response from the server:', err.request);
        setError("No response from server, try again later");
        setPending(false);

      } else {
        console.error('An unexpected error occured ', err);
        setError('An unexpected error occured ' + err);
        setPending(false);
      }
    }

  };

  return (
    <>
    <NavbarDefault />
    { !token? ( <div className="flex items-center justify-center text-red-600 font-bold gap-2"> 
      < MdError className="text-1xl"/>
      <span> Vennligst logg inn for å bruke denne funksjonen </span>
       </div>
      ) :     
      
      <div className="relative min-h-screen flex items-center justify-center"> {/* make page fill viewport and center content */}
        <div className="overlay" /> {/* overlay kept for visual effect */}
        <video src={videoBg} autoPlay loop muted className="absolute inset-0 w-full h-full object-cover" />

        <form onSubmit={handleSubmit} className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-3xl"> {/* increased max width to make form bigger */}
          
            <div className="bg-white/60 backdrop-blur-md rounded-lg shadow-lg p-8 md:p-12"> {/* larger padding and card */}
              
              <div className="flex flex-wrap justify-center -mx-3 mb-6">
                <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0 py-6"> {/* wider column: md:w-2/3 */}
  
                  <label className="block uppercase tracking-wide text-gray-700 text-sm font-semibold mb-3" htmlFor="grid-first-name" >
                    Navn
                  </label>
  
                  <input className="appearance-none block w-full bg-gray-100 text-gray-900 border border-gray-300 
             rounded py-3 px-4 mb-4 text-lg leading-tight focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-300" id="grid-first-name" value={formName || ""} readOnly />
  
                  <label className="block uppercase tracking-wide text-gray-700 text-sm font-semibold mb-3" htmlFor="grid-first-name" >
                    Email
                  </label>
  
                  <input className="appearance-none block w-full bg-gray-100 text-gray-900 border border-gray-300 
             rounded py-3 px-4 mb-4 text-lg leading-tight focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-300" id="grid-first-name" value={formEmail || ""} readOnly />
  
  
                  <label className="block uppercase tracking-wide text-gray-700 text-sm font-semibold mb-3" htmlFor="grid-first-name" >
                    Melding til andre beboer...
                  </label>
  
                  <textarea className="appearance-none block w-full bg-white text-gray-900 border border-gray-300 
             rounded py-4 px-4 mb-3 text-lg leading-tight focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-300" id="grid-first-name" onChange={(evt) => setFormMessage(evt.target.value)} maxLength={150} />
             { errorMsg && 
                <span className="text-red-600 mb-4"> {errorMsg} </span>
             }
  
                  <label htmlFor="laundryTime" className="block uppercase text-sm text-gray-700 font-semibold mt-4 mb-2 text-center">Velg tidspunkt</label>
                  <select id="laundryTime" className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-base border border-slate-200 rounded pl-3 pr-8 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                   onChange={(evt) => setLaundryTime(evt.target.value)}>
                    <option value="1">kl. 07:00 - 12:00</option>
                    <option value="2">kl. 12:00 - 17:00</option>
                    <option value="3">kl. 17:00 - 22:00</option>
                  </select>
  
                  <label htmlFor="machineId" className="block uppercase text-sm text-gray-700 font-semibold mt-4 mb-2 text-center">Velg vaskemaskin</label>
                  <select id="machineId" className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-base border border-slate-200 rounded pl-3 pr-8 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                   onChange={(evt) => setMachineId(evt.target.value)}>
                    <option value="1"> Siemen vaskemaskin </option>
                    <option value="2"> Samsung vaskemaskin </option>
                  </select>
  
                  {!pending && <button type="submit" 
                  className="mt-6 mx-auto mb-4 px-6 py-3 rounded w-full md:w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center">
                  Opprett vask</button>}
  
                  {pending &&
                    <button disabled className=" mt-6 mb-4 px-6 py-3 rounded w-full md:w-1/2 bg-blue-600 text-white font-bold flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      Vennligst vent
                    </button>
                  }
  
                </div>
  
              </div>
  
            </div>
  
          </div>
  
        </form>
  
      </div>
    } 
    <FooterDefault />
    </>
  )
}
// ...existing code...