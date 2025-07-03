import {jwtDecode} from "jwt-decode"
//no need to import React from "react" because we are not returning jsx, or <div></div> in our return function at the end



type UserInfoObject = {
    email: string;
    name: string;
    phoneNr: string;
    expireDateTime: number;
    issuer: string;
    audience: string;
}

 type MyJwtPayload = {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string; //due to how our claim is sending the information from the backend
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone": string; //due to how our claim is sending the information from the backend
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string //due to how our claim is sending the information from the backend
    exp: number; //expire date/time
    iss: string; //issuer
    aud: string;
  }

export const JWTInformation = (): UserInfoObject | null => {

    const token = localStorage.getItem("access_token"); //after user have logged in, we set the item in login page

    if(token){
        const decode = jwtDecode<MyJwtPayload>(token); //to decode the JWT 
        try{
            return { //returning/"sending" the decoded information elsewhere 
            email: decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"], //due to how our claim is sending the information from the backend
            name: decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"], //due to how our claim is sending the information from the backend
            phoneNr: decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone"], //due to how our claim is sending the information from the backend
            expireDateTime: decode.exp,
            issuer: decode.iss,
            audience: decode.aud
            };
        } catch(err){
            console.log("An error occured", err);
        }
    }

    return null; //we dont have to return html/jsx, we can also return null, and only return our desired object/datatype, etc
}
