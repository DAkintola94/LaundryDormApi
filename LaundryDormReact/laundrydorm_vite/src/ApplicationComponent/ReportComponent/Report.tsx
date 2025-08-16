import React, { useEffect, useState } from 'react';
import { NavbarDefault } from '../NavbackgroundDefault/NavbackgroundDefault';
import { FooterDefault } from '../FooterDefault/FooterDefault';
import axios  from 'axios';

export const Report = () => {

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
  // Loads VITE_API_BASE_URL from the environment variables based on the current Vite mode.
  // if running in 'docker' mode, it uses variables from `.env.docker`; otherwise, it falls back to .env.local or .env.[mode].

  console.log("Backend API URL, docker mode:", import.meta.env.VITE_API_BASE_URL);

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('1'); //need a default value so it doesn't auto set the option value to 0
  const [anonymousEmail, setAnonymousEmail] = useState('');
  const [isPending, setPendingButton] = useState(false);
  const [successMsg, setValidMessage] = useState('');
  const [errorMsg, setError] = useState('');



  const token = localStorage.getItem("access_token");

  const date = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const reportData = {
      AuthorName: name,
      InformationMessage: message,
      EmailAddress: anonymousEmail,
      CategoryID: Number(category),
      Date: date
    };
    setPendingButton(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/Advice/AdviceFetcher`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData)
      });
      if (!response.ok) {
        console.log("An error occured", response);
        throw new Error("Report failed");
      }
      setValidMessage("Din henvendelse har blitt registrert");
      setPendingButton(false);


    } catch (err) {
      console.log("An error occured", err);
      setPendingButton(false);
    }
  };

  const [userName, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [authcateCategory, setAuthCategory] = useState('1'); //need a default value so it doesn't auto set the option value to 0
  const [authMessage, setAuthMessage] = useState('');

  const handleAuthenticateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const authenticateReportData = {
      AuthorName: userName,
      EmailAddress: email,
      InformationMessage: authMessage,
      CategoryID: Number(authcateCategory),
      Date: date
    }
    setPendingButton(true);
    try{
      await axios.post(`${API_BASE_URL}/api/Advice/AdviceFetcher`,
        authenticateReportData, //This is the body, Axios automatically JSON-stringifies the request body, no need to json.stringify
        {
          headers: {
            "Content-Type" : "application/json"
          }
        })
        setPendingButton(false);
        setValidMessage("Henvendelsen har blitt registrert");
    } catch(err){
        if (axios.isAxiosError(err) && err.response) {
        // If server responded with a status code outside the 2xx range

        console.error('Backend error', err.response.status);
        setError(`Error ${err.response.data || "something went wrong"}`);
        setPendingButton(false);

      } else if (axios.isAxiosError(err) && err.request) {
        // No response received (e.g., server down)
        console.error('No response from the server:', err.request);
        setError("No response from server, try again later");
        setPendingButton(false);

      } else {
        console.error('An unexpected error occured ', err);
        setError('An unexpected error occured ' + err);
        setPendingButton(false);
      }
    }
  }

  useEffect(() => { //This is for incase we have a logged in user, and we want to set the value according to their info from backend
    const fetchData = async () => {
      await axios.get(`${API_BASE_URL}/api/Advice/AuthenticateReporter`,
        {
          headers: {"Authorization" : `Bearer ${token}`}
        })
        .then(response => {
          console.log(response.data); //remember to debugg the value from backend
          setUsername(response.data.authorName); //data.json name from the backend
          setEmail(response.data.emailAddress);  //data.json name from the backend
          setPendingButton(false);
        }
        )
    }
    if(token){
      fetchData();
    }
    else {
      console.log("No user is logged in, normal report standard to be used");
    }
  }, [token, API_BASE_URL])


  return (
    // ...existing code...
    <>
    <NavbarDefault/>
<div className="flex-1 flex flex-col items-center justify-center py-8 reportBackgroundImage">
  <div className="w-full max-w-md bg-black/70 rounded-lg shadow-lg p-8">
    {
      !token ? ( //if user is not logged in
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-2xl text-white">Navn</label>
          <input type="text" onChange={(e) => setName(e.target.value)} placeholder="Ditt navn..." name="name" className="text-white bg-gray-800 mb-2 p-2 border border-gray-700 rounded" required />

          <label className="text-2xl text-white">Email</label>
          <input type="email" placeholder="ABC@email.com..." onChange={(e) => setAnonymousEmail(e.target.value)} name="email" className="text-white bg-gray-800 mb-2 p-2 border border-gray-700 rounded" required />

          <label className="text-2xl text-white">Skriv feilmeldingen...</label>
          <textarea placeholder="..." onChange={(e) => setMessage(e.target.value)} name="message" className="text-white bg-gray-800 p-2 border border-gray-700 rounded min-h-[120px]" required />

          {successMsg && <span className="text-green-400 mb-2">{successMsg}</span>}
          {errorMsg && <span className="text-red-400 mb-2">{errorMsg}</span>}

          <label htmlFor="category" className="text-white text-2xl">Velg kategori</label>
          <select id="category" onChange={(e) => setCategory(e.target.value)} className="mb-2 p-2 border border-gray-700 rounded bg-white text-black" required>
            <option value="1">Forbedring</option>
            <option value="2">Vedlikehold</option>
            <option value="3">Feil</option>
            <option value="4">Annet</option>
          </select>

          {!isPending ? (
            <button type="submit" className="p-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold transition">Send</button>
          ) : (
            <button disabled className="p-2 rounded bg-blue-600 text-white font-bold flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Sender...
            </button>
          )}
        </form>
      ) : ( //If user is logged in
        <form onSubmit={handleAuthenticateSubmit} className="flex flex-col gap-4">
          <label className="text-2xl text-white">Navn</label>
          <input type="text" value={userName} placeholder="Ditt navn..." name="name" className="text-white bg-gray-800 mb-2 p-2 border border-gray-700 rounded" required readOnly />

          <label className="text-2xl text-white">Email</label>
          <input type="email" placeholder="ABC@email.com..." value={email} name="email" className="text-white bg-gray-800 mb-2 p-2 border border-gray-700 rounded" required readOnly />

          <label className="text-2xl text-white">Skriv feilmeldingen...</label>
          <textarea placeholder="..." onChange={(e) => setAuthMessage(e.target.value)} name="message" className="text-white bg-gray-800 p-2 border border-gray-700 rounded min-h-[120px]" required />

          {successMsg && <span className="text-green-400 mb-2">{successMsg}</span>}
          {errorMsg && <span className="text-red-400 mb-2">{errorMsg}</span>}

          <label htmlFor="category" className="text-white text-2xl">Velg kategori</label>
          <select id="category" onChange={(e) => setAuthCategory(e.target.value)} className="mb-2 p-2 border border-gray-700 rounded bg-white text-black" required>
            <option value="1">Forbedring</option>
            <option value="2">Vedlikehold</option>
            <option value="3">Feil</option>
            <option value="4">Annet</option>
          </select>

          {!isPending ? (
            <button type="submit" className="p-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold transition">Send</button>
          ) : (
            <button disabled className="p-2 rounded bg-blue-600 text-white font-bold flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Sender...
            </button>
          )}
        </form>
      )
    }
  </div>
</div>
<FooterDefault/>
</>
// ...existing code...
  );
}