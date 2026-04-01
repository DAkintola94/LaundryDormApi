

import { jwtDecode, JwtPayload } from "jwt-decode";

export function getValidAccess(){
    const token = localStorage.getItem("access_token");
    if(!token){
        return null;
    }

    try{
      const decoded = jwtDecode<JwtPayload>(token);
      const exp = decoded.exp;
      const now = Math.floor(Date.now() / 1000);

      if(!exp || exp <= now){
        localStorage.removeItem("access_token");
        return null;
      }
      
      return token;

    } catch {
      localStorage.removeItem("access_token");
      return null;
    }

}