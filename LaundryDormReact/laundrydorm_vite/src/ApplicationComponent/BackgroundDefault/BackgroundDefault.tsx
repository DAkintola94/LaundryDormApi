import {useState, useEffect} from "react"
import blueLaundry from '../../assets/blue_laundry.png'
import bgCss from '../../ApplicationComponent/BackgroundDefault/BackgroundDefault.module.css'
import 'aos/dist/aos.css'
import { globalFetchData } from "@/lib/authCall"
import { profileProps } from "@/lib/authCall"

export const BackgroundDefault = () => {

  const token = localStorage.getItem("access_token");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 


  const [dataFromApi, setData] = useState<profileProps>({ //Setting them to empty string for now
    imageUrl: "",
    error: "",
    phoneNr: "",
    userName: "",
    email: ""
  })
  
  useEffect(() => {
    const initializeUserData = async () => {
      const fetchData:profileProps = await globalFetchData(API_BASE_URL);
      setData({
        imageUrl: fetchData.imageUrl ?? "undefined",
        error: fetchData.error ?? "undefined",
        phoneNr: fetchData.phoneNr ?? "undefined",
        userName: fetchData.userName ?? "undefined",
        email: fetchData.email ?? "undefined"
      })
    }

    if(token){ //You still need token for useEffect to kick in when token value change, so we can call a function
      initializeUserData()
    }
    
  }, [API_BASE_URL, token])

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
            {dataFromApi.userName &&( //If we have any data in the props
              <span> {dataFromApi.userName} </span> //showing the users name if its populated
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
