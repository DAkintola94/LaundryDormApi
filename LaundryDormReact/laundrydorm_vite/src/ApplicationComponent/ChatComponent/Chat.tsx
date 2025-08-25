import React, { useState,useEffect } from 'react'
import { NavbarDefault } from '../NavbackgroundDefault/NavbackgroundDefault'
import { FooterDefault } from '../FooterDefault/FooterDefault'
import {HubConnectionBuilder, LogLevel} from '@microsoft/signalr';
import axios from 'axios'

export const Chat = () => {
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("access_token");
const [name, setName] = useState();
const [userImage, setImage] = useState<string | undefined>();
const [connection, setConnection] = useState();
const [message, setMessage] = useState<Array<{user: string, message: string}>>([]);

console.log(API_BASE_URL);

useEffect(() => {
  const fetchUserInfo = async () => {
    await axios.get(`${API_BASE_URL}/api/ProfileManagement/AuthenticateUser`,{
      headers:{"Authorization": `Bearer ${token}`}
    })
    .then(response => {
      console.log(response.data);
      setName(response.data.userName); //getting users name from server, and setting the usestate
      setImage(response.data.profilePictureUrlPath); //getting the users image url path
    })
  }
  if(token){
    fetchUserInfo();
  } else {
    console.log("No user is currently logged in");
  }
}, [token, API_BASE_URL, setName, setImage])

const joinChatRoom = async (user, message) => {
  try{
    const connection = new HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/hubs/chat`)
    .configureLogging(LogLevel.Information)
    .build();

    connection.on("ReceivedMessage", (user, message) => {
      setMessage(prev => [...prev, {user, message}]);
    }); //This way, server can push message to the client

    await connection.start();
    await connection.invoke("SendMessage", {user, message});
    setConnection(connection);

  } catch (e){
    console.log(e);
  }

}


  return (
    <>
    <NavbarDefault />
    
    <div className="flex items-center justify-center p-6">
      <div className='w-32 py-4 flex-none bg-purple-900'> 01 </div>
      <div className="w-64 py-4 flex-initial bg-yellow-600" > {name}: is the name </div>
      <div className="w-32 py-4 flex-initial bg-gray-800"> 03</div>
    </div>

    <div className="h-screen flex flex-col">
      <div className="bg-gray-200 flex-1 overflow-y-scroll">
        <div className="px-4 py-2">
          <div className="flex items-center mb-2">
            <img className="w-8 h-8 rounded-full mr-2" src={userImage} alt="profil_pic"/>
            <div className="font-medium"> {name} </div>
          </div>
            <div className="bg-white rounded-lg p-2 shadow mb-2 max-w-sm"> Is this where Signalr sender should be? </div>

            <div className="flex items-center justify-end">
              <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm"> This is for whoever is replying? </div>
              <img className="w-8 h-8 rounded-full" src="whoever is replaying image" alt="replierImg"/>
            </div>

        </div>
      </div>
      <div className="bg-gray-100 px-4 py-10">
        <div className="flex items-center">
          <input className="w-full border rounded-full py-2 px-4 mr-2" type="text" placeholder='Skriv meldingen din' />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full">
            Send
          </button>
        </div>
      </div>
    </div>
    <FooterDefault />
    </>
  )
}
