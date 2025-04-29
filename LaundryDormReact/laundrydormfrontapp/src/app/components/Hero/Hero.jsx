import React from 'react'
import blueLaundry from '../../../assets/blue_laundry.png'
import bgCity from '../../../assets/city_lake.jpg'
import Image from 'next/image'

const bgStyle = { //This is plain JavaScript creating an object (bgStyle) where the keys and values represent CSS styles
    //JavaScript can create objects that mimic CSS rules like this.
    //But it’s React that understands how to apply that object to an HTML element's style attribute.
    //In React, all CSS property names become camelCase (background-image → backgroundImage).
    //here, we are using plain JavaScript to create a React-style inline CSS object.
    backgroundImage: `url(${bgCity.src})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "520px",
    width: "100vw",
};

export const Hero = () => {
  return (
    <div style ={bgStyle}>
    <div className="dark:bg-black/60 bg-white/80 backdrop-blur-sm
    dark:text-white duration-300 h-[520px] flex">
        <div className = "container grid grid-cols-1 place-items-center">
            {/* text content section */}
            <div className="text-center space-y-5 py-14">
                <p data-aos="fade-up"
                className="text-[#eed963] 
                text-3xl font-semibold uppercase"> Bok vask nå 
                </p>
                <h1 data-aos="fade-up" 
                data-aos-delay="600" className="text-4xl md:text-6xl font-bold text-[#60116e]">Eller reserver på forhånd</h1>
                <p
                data-aos="fade-up"
                data-aos-delay="1000"
                className="tracking-[8px] text-base sm:text-xl font-semibold"
                >
                    www.laundrydorm.com
                </p>
            </div>
            {/* Image section */}
            <div data-aos="zoom-in-right"
            data-aos-duration="1000">
                <Image src={blueLaundry} alt="blue laundry" 
                className="w-75 h-auto
                translate-y-10 sm:translate-y-0 "
                />
            </div>
        </div>
    </div>
    </div>
  );
};
