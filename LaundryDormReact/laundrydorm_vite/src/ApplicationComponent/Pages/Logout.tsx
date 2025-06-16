import React from 'react'
import {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

export const Logout = () => {

  const navigate = useNavigate();

    useEffect (() => {
      const token = localStorage.getItem("access_token"); //remember, localStorage is global on the site once it stores the value
      if(token){
        try{

          localStorage.removeItem("access_token");
          navigate('/', {replace: true}); //navigate to root after logout successfull

        } catch(err){

          console.log("En feil oppstod", err);
        }
        
      }

    }, []);

  return (
    <>

    </>
  )
}
