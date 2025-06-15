import React from 'react'
import jwt_decode from "jwt-decode"; //for decoding JWT payload

export const Profile = () => {
    const getToken = localStorage.getItem("access_token");
    
  return (
    <div>Profile</div>
  )
}
