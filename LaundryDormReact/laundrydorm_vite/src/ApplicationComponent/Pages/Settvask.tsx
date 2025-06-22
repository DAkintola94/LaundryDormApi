import { NavbarDefault } from "../NavbackgroundDefault/NavbackgroundDefault"
import { FooterDefault } from "../FooterDefault/FooterDefault";
import { useState, useEffect } from "react"
import { JWTInformation } from "./JWTInformation"

export const Settvask = () => {

  const [pending, setPending] = useState(false);
  const [formMessage, setFormMessage] = useState('')
  const [formEmail, setFormEmail] = useState('');
  const [formName, setFormName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [laundryTime, setLaundryTime] = useState('1'); //need a default value so it doesn't auto set the option value to 0
  const token = localStorage.getItem("access_token");


  console.log(token);

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
    }

  }, [])                                              //with the array as second argument means this effect will only run once


  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);

    const laundrySessionData = { //variable name on the left, that gets value from the right, needs to match our variable model name in c sharp
      SessionUser: formName,
      Email: formEmail,
      UserMessage: formMessage,
      PhoneNr: phoneNumber,
      SessionId: Number(laundryTime), //its for the time period the user want to set their laundry, backend
    };

    if (!token) {
      setPending(false);
      console.warn("No token found. User might not be logged in.");
      setError("Vennligst, logg inn for å bruke denne tjenesten");
      return;
    }

    try {
      const response = await fetch('http://localhost:7054', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          //"Authorization": `Bearer ${access_token}` needed later?
        },
        body: JSON.stringify(laundrySessionData)
      });

      if (!response.ok) {
        console.error("Failed to submit form:", response.statusText);
        setPending(false);
        return;
      }

      const data = await response.json(); //what the backend returns upon ok
      console.info("Form submitted successfully:", data);
      setPending(false);

    } catch (err) {
      console.error("An error occurred while submitting the form:", err);
      setPending(false);
    }
  };

  return (
    <>
      <div className="laundryBG_set">
        { !token && <div> Please log in to use this feature</div>
        
        }
        <form onSubmit={handleSubmit} >

          <div>
            <NavbarDefault />

            <div className="flex flex-wrap justify-center -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 py-10">

                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name" >
                  Navn
                </label>

                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 
           rounded py-1 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" value={usersInfo?.name || ""} readOnly required></input>

                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name" >
                  Email
                </label>

                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 
           rounded py-1 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" value={usersInfo?.email || ""} readOnly required></input>

                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name" >
                  Telefon nummer
                </label>

                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 
           rounded py-1 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" value={usersInfo?.phoneNr || ""} readOnly required></input>


                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name" >
                  Melding...
                </label>

                <textarea className="appearance-none block w-full bg-white text-gray-700 border border-red-500 
           rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" onChange={(evt) => setFormMessage(evt.target.value)} maxLength={150}></textarea>

                <label htmlFor="laundryTime" className="block uppercase text-xs text-gray-700 font-bold text-center">Velg tidspunkt</label> {/* NB! justify-center only works on flex containers, not for label since label is an inline element. use text-center for inline */}
                <select id="laundryTime" className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                 onChange={(evt) => setLaundryTime(evt.target.value)}>
                  <option value="1">kl. 07:00 - 12:00</option>
                  <option value="2">kl. 12:00 - 17:00</option>
                  <option value="3">kl. 17:00 - 22:00</option>
                </select>

                {!pending && <button type="submit" 
                className="mt-4 mx-auto mb-4 p-2 border rounded w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold items-center justify-center flex">
                Registrer</button>} {/*mt is for margin-top, gives space between labels/form*/}

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
                    Sessjon opprettes
                  </button>
                }

                <FooterDefault />

              </div>

            </div>

          </div>

        </form>

      </div>


    </>
  )
}
