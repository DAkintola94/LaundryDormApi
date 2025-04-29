import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

export const Contact = () => {

const [startTime, setStartTime] = useState("");
const  [endTime, setEndtime] = useState("");
const [error, setError] = useState("");

//e.target.value is used to get the value of the input field. 
//similar to document.getElementById("inputField").value in vanilla JS

//useEffect is a hook that allows you to perform side effects in function components.
//in this case, it triggers when either startTime or endTime changes.
useEffect(() => {
    validateTime(startTime, endTime);
}, [startTime, endTime]);

const handleStartChange = (e) => {
    setStartTime(e.target.value); // targets the value the user inputs in the start time field
    validateTime(e.target.value, endTime); //comparing the current start time against the newly changed end time.
};

const handleEndChange = (e) => {
    setEndtime(e.target.value); // targets the value the user inputs in the end time field
    validateTime(startTime, e.target.value); //comparing the current end time against the newly changed start time.
};

const validateTime = (start, end) => {
    if(!start || !end){
        setError("Velg et start eller slutt tid");
        return;
    }
    const [startHour, startMin] = start.split(":").map(Number); //map function iterates over each element of the array ["12", "30"] and applies the Number function to convert each string element into a number
//Example: ["12", "30"] becomes [12, 30]
    const [endHour, endMin] = end.split(":").map(Number);

    const startDate = new Date(0, 0, 0, startHour, startMin);
    const endDate = new Date(0, 0, 0, endHour, endMin);

    const diffMs = endDate - startDate;
    const diffHrs = diffMs / (1000 * 60 * 60);

    if  (diffHrs <= 0){
        setError("Slutttid må være etter starttid.");
    }   else if (diffHrs > 3){
        setError("Du kan ikke reservere mer enn 3 timer.");
    }   else {
        setError("");
    };
};

console.log(handleStartChange);

  return (
    <div className="bg-[#eed963] text-black sm:min-h-[600px]
    sm:grid sm:place-items-center duration-300 pt-24 pb-10sm:pb-0">
        <div className="container">
            <div className="grid grid-cols-1 sm:grid-cols-2 place-items-center">
            {/* left text content section */}
            <div className="space-y-5 sm:p-16 pb-6"> 
                <h1 data-aos="fade-up" className="text-2xl sm:text-3xl
                 font-bold">Nr til vaktmester</h1>
                <h1 data-aos="fade-up" className="text-3xl sm:text-4xl font-bold">
                    Kontakt vaktmester ved eventuelt problemer
                </h1>
                <p data-aos="fade-up" className="leading-8 tracking-wide">
                Denne nettsiden er utviklet for beboere med tilgang til fellesvaskeriet i borettslaget. 
                Her kan du enkelt reservere vasketid, se tilgjengelige maskiner og holde oversikt over dine bestillinger.
                Tjenesten er kun tilgjengelig for registrerte beboere. Hvis du ikke har tilgang,
                 men bor i området, vennligst ta kontakt med styret eller vaktmester for å få nødvendig tilgang.
                </p>
                <button className="bg-black text-white px-4
                py-2 rounded-lg"> Sett vask nå</button>
            </div>
            {/* right side form content section */}
            <div>
                <div className="max-w-[350px] mx-auto">
                    <h1 className="uppercase text-2xl text-white bg-black px-5 py-3">
                        Reserve vasketid
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 
                    gap-x-2 bg-white p-5">
                    <input
                    className="inputField"
                    type="time"
                    value={startTime}
                    onChange={handleStartChange}
                    placeholder="Start"/>
                    <input
                    className="inputField"
                    type="time"
                    value={endTime}
                    onChange={handleEndChange}
                    placeholder="Slutt"/>
                    <input
                    className="inputField"
                    type="date"/>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
  );
};
