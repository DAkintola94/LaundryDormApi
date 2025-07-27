import React from 'react'
import { NavbarDefault } from '../NavbackgroundDefault/NavbackgroundDefault'
import { FooterDefault } from '../FooterDefault/FooterDefault'
import { useState, useEffect } from 'react'
import axios from 'axios'

export const UserOverview = () => {

type UserOverview = {
    email: string | null;
    userFirstName: string | null;
    userLastName: string | null; 
    phoneNumber: string | null;
    profileId: string | null;
};

const[modalValue, setModalValue] = useState<UserOverview | null>(null);
const[usersData, setUsersData] = useState<UserOverview[]>([]); //setting usestate to map object, as array. since .map only work with array
const[loading, setLoading] = useState(true);
const token = localStorage.getItem("access_token");

useEffect(() => {
  const fetchData = async () => {
    await axios.get('https://localhost:7054/api/Admin/UsersOverview',
      {
        headers: {"Authorization" : `Bearer ${token}`}
      })
      .then(response => {
        setUsersData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.log("An error occured", err);
        setLoading(false);
      })
  }
      if(token){ //remember to move it out of the fetchData scope function
        fetchData();
      } else {
        console.log("Unauthorized user");
      }
}, [token])


  return (
    <div className="min-h-screen flex flex-col">
      <NavbarDefault/>

      <FooterDefault />
    </div>

  )
}
