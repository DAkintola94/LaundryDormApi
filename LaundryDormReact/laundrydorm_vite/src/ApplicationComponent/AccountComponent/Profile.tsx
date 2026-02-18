import React from 'react'
import { NavbarDefault } from '../NavbackgroundDefault/NavbackgroundDefault'
import { FooterDefault } from '../FooterDefault/FooterDefault'
import { FaUserLock } from 'react-icons/fa'
import {useState, useEffect} from 'react'
import { globalUserProfileData } from '@/lib/authCall'

export const Profile = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
  // Loads VITE_API_BASE_URL from the environment variables based on the current Vite mode.
  // if running in 'docker' mode, it uses variables from `.env.docker`; otherwise, it falls back to .env.local or .env.[mode].

  const token = localStorage.getItem("access_token");
  const [loading, setLoading] = useState(false);

  const [userFirstName, setFirstName] = useState("");
  const [userLastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profile_id, setId] = useState("");
  const [usersEmail, setEmail] = useState("");
  const [usersAddress, setAddress] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [fetchError, setFetchError] = useState("");

  console.log("image url", imageUrl);
  console.log(API_BASE_URL);



  useEffect(() => {
    const fetchData = async() => {
      setLoading(false);
      const getData = await globalUserProfileData( //Void promise, we cant enter methods property, it gives use value based on logics
        API_BASE_URL,
        { //Setting all useState that will be used, its a void function, but a usestate here
          setFirstName,
          setLastName,
          setId,
          setEmail,
          setPhoneNumber,
          setAddress,
          setImageUrl,
          setLoading,
          setFetchError
        }
      );
      console.log(getData);

    }
    if(token){
      fetchData();
    } 
    return
  },[token, API_BASE_URL] )

  return (
    <>
    <NavbarDefault />
    <div>
        {
        loading? (
          <div className="flex items-center justify-center text-blue-600 font-bold gap-2">
                  <img src="src/assets/spinloading.svg" title='Loading image' className="h-[5vh] w-[5vh]" />
                  <span> Vennligst vent </span>
          </div>
        ) : 

        (
          <div className="flex items-center justify-center py-3">
            {/*
              <img title="profile_image" src={imageUrl} className="h-[5vh] w-[5vh]" />
            */}

            Velkommen {userFirstName} {userLastName}, denne siden er under konstruksjon

          </div>
        )
        }
    </div>
    <FooterDefault />
    </>
  )
}
