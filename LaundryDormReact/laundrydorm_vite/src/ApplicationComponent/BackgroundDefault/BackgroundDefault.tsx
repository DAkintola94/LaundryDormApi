//import React from 'react'
//import bgCity from '../../../assets/city_lake.jpg'
import {useState, useEffect} from "react"
import blueLaundry from '../../assets/blue_laundry.png'
import bgCss from '../../ApplicationComponent/BackgroundDefault/BackgroundDefault.module.css'
import 'aos/dist/aos.css'
import axios from 'axios';

export const BackgroundDefault = () => {

  const token = localStorage.getItem("access_token");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
  const [populateName, setName] = useState("");
  //const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    const fetchUserInfomation = async () => {
      await axios.get(`${API_BASE_URL}/api/ProfileManagement/AuthenticateUser`,{
        headers: {"Authorization" : `Bearer ${token}`}
      })
      .then(response => {
        //console.log("data response from the backend", response.data);
        setName(response.data.userName);
        //setImageUrl(response.data.profilePictureUrlPath);
      })
    }
    if(token){
      fetchUserInfomation();
    }
    else {
      console.log("No user is currently signed in");
    }

  }, [token, API_BASE_URL])

  return (
    <div className={bgCss.backgroundImage}> 
    <div className="dark:bg-black/50 background-blur-sm dark:text-white duration-300
    min-h-screen flex">
      <div className="container grid grid-cols-1 place-items-center">
        {/* text content section*/}
        <div className="text-center space-y-5 py-14">
            <p data-aos="fade-up"
            className="text-[#ffff00]
            text-3xl font-semibold"> Velkommen
            {token && populateName &&(
              <span> {populateName} </span> //showing the users name if its populated
            )}
            </p>
            <h1 data-aos="fade-up"
            data-aos-delay="600" className="text-4xl md:text-3xl font-bold text-[#ffff00]"> Bok vask nå, eller reserve på forhånd </h1>
            <p
            data-aos="fade-up"
            data-aos-delay="1000"
            className=" text-white sm:text-xl font-semibold"
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
