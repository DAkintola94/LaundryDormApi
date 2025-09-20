import React from 'react'
import { NavbarDefault } from '../NavbackgroundDefault/NavbackgroundDefault'
import { FooterDefault } from '../FooterDefault/FooterDefault'
import { FaUserLock } from 'react-icons/fa'
import {useState, useEffect} from 'react'
import axios from 'axios'

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
      setLoading(true);
      await axios.get(`${API_BASE_URL}/api/ProfileManagement/ProfilePage`,
      {
        headers:{"Authorization" : `Bearer ${token}`}
      })
      .then(response => {
        setLoading(false);
        console.log("See object value", response.data);
        setFirstName(response.data.userFirstName);
        setLastName(response.data.userLastName);
        setId(response.data.profileId);
        setEmail(response.data.email);
        setPhoneNumber(response.data.phoneNumber);
        setAddress(response.data.userAddress);
        setImageUrl(response.data.userImageURL);
      })
      .catch(err => {
        setLoading(false);
        setFetchError(err);
        console.log(err);
      })
    }
    if(token){
      fetchData();
    } else {
      console.log("No user is signed in");
    }
  },[token, API_BASE_URL] )

  return (
    <>
    <NavbarDefault />
    <div>
      {
        !token? (
          <div className="flex items-center justify-center text-red-500 font-bold gap-2">
            <FaUserLock className="text-1xl" />
            <span> Vennligst logg inn for å bruke denne funksjonen </span>
          </div>
        ) 
        
        : 
        
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
