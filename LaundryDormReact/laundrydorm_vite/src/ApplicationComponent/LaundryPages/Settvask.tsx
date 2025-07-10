import { NavbarDefault } from "../NavbackgroundDefault/NavbackgroundDefault"
import { FooterDefault } from "../FooterDefault/FooterDefault";
import { useState, useEffect } from "react"
import { JWTInformation } from "../Pages/JWTInformation" //importing JWT functions, its not sending jsx/html or react, its returning/sending token object value
import { useNavigate } from "react-router-dom";
import { MdError } from "react-icons/md";

export const Settvask = () => {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [formMessage, setFormMessage] = useState('')
  const [formEmail, setFormEmail] = useState('');
  const [formName, setFormName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [expiredDate, setExpiredDate] = useState<number | null>(null);
  const [errorMsg, setError] = useState('');
  const [sessionId, setSessionId] = useState<number | null>(null); //either be a number or null before we get a value

  const [machineId, setMachineId] = useState('1'); //value for the machine id, default value need to be 1 so it doesn't become 0
  const [laundryTime, setLaundryTime] = useState('1'); //need a default value so it doesn't auto set the option value to 0

  
  const token = localStorage.getItem("access_token");
  
  console.log(expiredDate);

  console.log(formEmail);
  console.log(formName);
  console.log(phoneNumber);
  console.log("The token value is",token);

  type UsersInformation = {
    email: string,
    name: string,
    phoneNr: string;
    expireDateTime: number;
    issuer: string;
    audience: string;
  };


  const [usersInfo, setUsersInfo] = useState<UsersInformation | null>(null); //using it to set or get value from the UserInfo object

  useEffect(() => {
    const info = JWTInformation();  //getting data from the JWT page we created, that returns token value, and not jsx, html or react
    setUsersInfo(info)                                 //useState "setUsersInfo" part is used to set the usersInfo part to become the UsersInformation object default 
    //this is needed since the data is being sent as object, and not single string

    if (info) {
      setFormName(info?.name); //using useState setter to set the name, email and phone number we retreive from JWT page 
      setFormEmail(info?.email);
      setPhoneNumber(info?.phoneNr);
      setExpiredDate(info?.expireDateTime);
    }
  }, []) //with the array as second argument means this effect will only run once


  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);

    const laundrySessionData = { //variable name on the left, that gets value from the right, needs to match our variable model name in c sharp
      userMessage: formMessage,
      machineId: Number(machineId), //converting to Number
      sessionTimePeriodId: Number(laundryTime), //its for the time period the user want to set their laundry, backend
      reservationTime: new Date().toISOString(), //reservation time/date

    }; 

    if (!token) {
      setPending(false);
      console.warn("No token found. User might not be logged in.");
      setError("Vennligst, logg inn for å bruke denne tjenesten");
      return;
    }

    try {
      const response = await fetch('https://localhost:7054/api/Laundry/StartSession', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` //Sending Jwt token to the backend. 
          //Always send the token to the backend like this when you want to verify users information!
        },
        body: JSON.stringify(laundrySessionData) //We have to stringify the data on frontend because 
        //the fetch API and most HTTP clients send data as string in the request body, not as javascript object.
        //HTTP request (like POST) send the body as a string, not as javascript object.
        
        //[FromBody] tells ASP.NET core to parse the incoming JSON string and convert it into a c sharp model object
      });

      if (!response.ok) {
        console.error("Failed to submit form:", response.statusText);
        setPending(false);
        return;
      }

      const data = await response.json(); //what the backend returns upon ok
      console.info("Form submitted successfully, session ID is ", data.id);
      setSessionId(data.backendSessionId); //setter for sessionId we got in response from the backend.
      //data is the response we are getting, the next variable is the variable name of the json the backend sends !must match!

      console.log(sessionId);

      setPending(false);

      navigate('/success', {
        replace: true, //prevent user from going back
        state: {
          ID: data.backendSessionId, //Value we want to pass to the redirected page
        }
    });

    } catch (err) {
      console.error("An error occurred while submitting the form:", err);
      setPending(false);
    }
  };

  return (
    <>
    { !token? ( <div className="flex items-center justify-center text-red-600 font-bold gap-2"> 
      < MdError className="text-1xl"/>
      <span> Vennligst logg inn for å bruke denne funksjonen </span>
       </div>
      ) :     
      
      <div className="laundryBG_set">
        <form onSubmit={handleSubmit} >

          <div>
            <NavbarDefault />

            <div className="flex flex-wrap justify-center -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 py-10">

                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name" >
                  Navn
                </label>

                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 
           rounded py-1 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" value={usersInfo?.name || ""} readOnly></input>

                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name" >
                  Email
                </label>

                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 
           rounded py-1 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" value={usersInfo?.email || ""} readOnly></input>


                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name" >
                  Melding til andre beboer...
                </label>

                <textarea className="appearance-none block w-full bg-white text-gray-700 border border-red-500 
           rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" onChange={(evt) => setFormMessage(evt.target.value)} maxLength={150}></textarea>
           { errorMsg && 
              <span className="text-red-400 mb-4"> {errorMsg} </span>
           }

                <label htmlFor="laundryTime" className="block uppercase text-xs text-gray-700 font-bold text-center">Velg tidspunkt</label> {/* NB! justify-center only works on flex containers, not for label since label is an inline element. use text-center for inline */}
                <select id="laundryTime" className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                 onChange={(evt) => setLaundryTime(evt.target.value)}>
                  <option value="1">kl. 07:00 - 12:00</option>
                  <option value="2">kl. 12:00 - 17:00</option>
                  <option value="3">kl. 17:00 - 22:00</option>
                </select>

                <label htmlFor="machineId" className="block uppercase text-xs text-gray-700 font-bold text-center">Velg vaskemaskin</label> {/* NB! justify-center only works on flex containers, not for label since label is an inline element. use text-center for inline */}
                <select id="machineId" className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                 onChange={(evt) => setMachineId(evt.target.value)}>
                  <option value="1"> Siemen vaskemaskin </option>
                  <option value="2"> Samsung vaskemaskin </option>
                </select>

                {!pending && <button type="submit" 
                className="mt-4 mx-auto mb-4 p-2 border rounded w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold items-center justify-center flex">
                Opprett vask</button>} {/*mt is for margin-top, gives space between labels/form*/}

                {pending &&
                  <button disabled className=" mt-4 mb-4 p-2 border rounded w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center"> {/*Move the button center instead*/}
                    {pending ? (
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

                <FooterDefault />

              </div>

            </div>

          </div>

        </form>

      </div>
    }  
    </>
  )
}
