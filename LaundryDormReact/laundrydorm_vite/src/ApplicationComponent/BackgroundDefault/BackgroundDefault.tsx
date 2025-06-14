//import React from 'react'
//import bgCity from '../../../assets/city_lake.jpg'
//import {useState} from "react"
import blueLaundry from '../../assets/blue_laundry.png'
import bgCss from '../../ApplicationComponent/BackgroundDefault/BackgroundDefault.module.css'
import 'aos/dist/aos.css'

export const BackgroundDefault = () => {

  return (
    <div className={bgCss.backgroundImage}> 
    <div className="dark:bg-black/50 bg-white/80 background-blur-sm dark:text-white duration-300
    min-h-screen flex">
      <div className="container grid grid-cols-1 place-items-center">
        {/* text content section*/}
        <div className="text-center space-y-5 py-14">
            <p data-aos="fade-up"
            className="text-[#eed963]
            text-3xl font-semibold"> Bok vask nå
            </p>
            <h1 data-aos="fade-up"
            data-aos-delay="600" className="text-4xl md:text-6xl font-bold text-[#eed963]"> Eller reserve på forhånd </h1>
            <p
            data-aos="fade-up"
            data-aos-delay="1000"
            className="tracking-[8px] text-base sm:text-xl font-semibold"
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
