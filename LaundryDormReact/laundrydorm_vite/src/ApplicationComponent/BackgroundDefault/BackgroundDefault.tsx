//import React from 'react'
//import bgCity from '../../../assets/city_lake.jpg'
import {useState, useEffect} from "react"
import blueLaundry from '../../assets/blue_laundry.png'
import bgCss from '../../ApplicationComponent/BackgroundDefault/BackgroundDefault.module.css'
import { JWTInformation } from "../Pages/JWTInformation" //importing JWT functions, its not sending jsx/html or react, its returning/sending token object value
import 'aos/dist/aos.css'

export const BackgroundDefault = () => {

    type UsersInformation = {
    email: string,
    name: string,
    phoneNr: string;
    expireDateTime: number;
    issuer: string;
    audience: string;
  };
  const [usersName, setUsersName] = useState('');

  const token = localStorage.getItem("access_token");
  const [usersInfo, setUsersInfo] = useState<UsersInformation | null>(null); //using it to set or get value from the UserInfo object
  console.log(usersInfo);
  
  useEffect(() => {
    const info = JWTInformation();  //getting data from the JWT page we created, that returns token value, and not jsx, html or react
    setUsersInfo(info)                                 //useState "setUsersInfo" part is used to set the usersInfo part to become the UsersInformation object default 
    //this is needed since the data is being sent as object, and not single string

    if (info) {
      setUsersName(info?.name); //using useState setter to set the name, email and phone number we retreive from JWT page 
       const currentTime = Date.now() / 1000; //current time in seconds

    const tokenExpiredDate = info?.expireDateTime;
    if(tokenExpiredDate && currentTime > tokenExpiredDate){ //checking if current time is larger than token's expired time, in second
        localStorage.removeItem("access_token");
    }
    }

  }, [])

  return (
    <div className={bgCss.backgroundImage}> 
    <div className="dark:bg-black/50 bg-white/80 background-blur-sm dark:text-white duration-300
    min-h-screen flex">
      <div className="container grid grid-cols-1 place-items-center">
        {/* text content section*/}
        <div className="text-center space-y-5 py-14">
            <p data-aos="fade-up"
            className="text-[#eed963]
            text-3xl font-semibold"> Velkommen
            {token && usersName &&(
              <span> {usersName} </span> //showing the users name if its populated
            )}
            </p>
            <h1 data-aos="fade-up"
            data-aos-delay="600" className="text-4xl md:text-3xl font-bold text-[#eed963]"> Bok vask nå, eller reserve på forhånd </h1>
            <p
            data-aos="fade-up"
            data-aos-delay="1000"
            className=" text-base sm:text-xl font-semibold"
            >
                www.laundrydorm.com
            </p>
        </div>
        
      

        {/* Image section*/}
        <div data-aos="zoom-in-right"
        data-aos-duration="1000">
            <img src={blueLaundry} alt="blue laundry"
            className="w-[300px] h-auto
            translate-y-10 sm:translate-y-0"
            />
        </div>
        </div>
    </div>
    </div>
  );
};
