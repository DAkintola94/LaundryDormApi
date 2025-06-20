import React, { useState } from 'react';
import { NavbarDefault } from '../NavbackgroundDefault/NavbackgroundDefault';
import { FooterDefault } from '../../ApplicationComponent/FooterDefault/FooterDefault';

export const Report = () => {

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('1');
  const [email, setEmail] = useState('');
  const [isPending, setPendingButton] = useState(false);
  const [successMsg, setValidMessage] = useState('');

  const date = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const reportData = {
      AuthorName: name,
      InformationMessage: message,
      EmailAddress: email,
      CategoryID: Number(category),
      Date: date
    };
    setPendingButton(true);

    try {
      const response = await fetch('https://localhost:7054/api/Advice/AdviceFetcher', {
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

  return (
    <div className="reportBackgroundImage">
      <form onSubmit={handleSubmit}>
        <div className="min-h-screen flex flex-col">
          <NavbarDefault />
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <label className="text-2xl text-white"> Navn </label>
            <input type="text" onChange={(e) => setName(e.target.value)} placeholder="Ditt navn..." name="name" className="text-white mb-4 p-2 border rounded w-full max-w-md" required />

            <label className="text-2xl text-white"> Email </label>
            <input type="email" placeholder="ABC@email.com..." onChange={(e) => setEmail(e.target.value)} name="email" className="text-white mb-4 p-2 border rounded w-full max-w-md" required />

            <label className="text-2xl text-white"> Skriv feilmeldingen...</label>
            <textarea placeholder="..." onChange={(e) => setMessage(e.target.value)} name="message" className="text-white p-2 border rounded w-full max-w-md min-h-[120px]" required />

            {successMsg && <span className="text-green-500 mb-4"> {successMsg} </span>}

            <label htmlFor="kategori" className="text-white text-2xl"> Velg kategori </label>
            <select id="kategori" onChange={(e) => setCategory(e.target.value)} name="category" className="mb-4 p-2 border rounded w-full max-w-md bg-white" required>
              <option value="1"> Forbedring </option>
              <option value="2"> Vedlikehold </option>
              <option value="3"> Feil </option>
              <option value="4"> Annet </option>
            </select>

            {!isPending && <button type="submit"
              className="mb-4 p-2 border rounded w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold">
              Send </button>}

            {isPending && <button disabled type="submit"
              className="mb-4 p-2 border rounded w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold">
              Sender... </button>}
          </div>
          <FooterDefault />
        </div>
      </form>
    </div>
  );
}