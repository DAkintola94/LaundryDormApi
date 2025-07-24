import React from 'react'
import axios from "axios"
import {useState, useEffect} from 'react'
import { NavbarDefault } from '../NavbackgroundDefault/NavbackgroundDefault'
import { FooterDefault } from '../FooterDefault/FooterDefault'
import { LuMessageCircle } from 'react-icons/lu'
import { MdError } from 'react-icons/md'


export const Historic = (): React.JSX.Element => {

  type UsersSessionHistoric = { //must match the viewmodel name of the backend. camelCase!
    //when ASP.NET Core sends this as JSON, it automatically converts to camelCase
    
    sessionUser: string;
    sessionId: number;
    email: string | null; //expecting string, or no value (null)
    reservationDate: string | null; // string, because backend sends ISO string (date)
    reservationTime: string | null; // string, because backend sends ISO string (date)
    laundryStatusDescription: string | null;
    startPeriod: string | null; // string, because backend sends ISO string (date)
    endPeriod: string | null; // string, because backend sends ISO string (date)
    machineName: string | null;
    userMessage: string | null;
  };

  const [modalValue, setModalState] = useState<UsersSessionHistoric | null>(null);
  const [userValidData, setData] = useState<UsersSessionHistoric[]>([]); //setting usestate to map object, as array. since .map only work with array
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchData = async () =>{
    await axios.get('https://localhost:7054/api/Laundry/SessionHistoric',
      {
        headers: {"Authorization" : `Bearer ${token}`}
      })
    .then(response => {
       setData(response.data) //Axios puts the actual response data in the .data property of the response object.
      })                      //setting our populated data into the useState of userValidData [array]
      .catch(err => {
        console.log(err.message);
      })
    }
    fetchData(); //calling the async function
  }, [])


  return (
  <div className="min-h-screen flex flex-col">
        <NavbarDefault/>  
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-[1200px] mx-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Navn
            </th>

            <th scope="col" className="px-6 py-3">
             Vask ID
            </th>

            <th scope="col" className="px-6 py-3"> 
            Reservasjon dato
            </th>

            <th scope="col" className="px-6 py-3">
              Maskin Navn
            </th>

            <th scope="col" className="px-6 py-3"> 
            Start/Slutt 
            </th>

            <th scope="col" className="px-6 py-3">
            Status
            </th>

            <th scope="col" className="px-6 py-3">
               <LuMessageCircle/>
            </th>
          </tr>
        </thead>

        <tbody>
          {!token && userValidData.length === 0 ? (
          <tr>
            <td colSpan={7}>
              <div className="flex items-center justify-center text-red-600 font-bold gap-2"> 
          <MdError className="text-1x1" />
          <span> Ingen informasjon tilgjengelig </span>
          </div>
          </td>
          </tr>
          ) : (
          userValidData?.map((rowValue, idx) => ( 
          <tr key={idx} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {rowValue.sessionUser}
            </th>

            <td className="px-6 py-4">
             {rowValue.sessionId}
            </td>

            <td className="px-6 py-4">
             {rowValue.reservationTime}
            </td>

            <td className="px-6 py-4">
             {rowValue.machineName}
            </td>

            <td className="px-6 py-4">
             {rowValue.startPeriod} 
             - 
             {rowValue.endPeriod}
            </td>

            <td className="px-6 py-4">
             {rowValue.laundryStatusDescription}
            </td>

            <td className="px-6 py-4 text-right">
             {
              <button title="modal" onClick={() => setModalState(rowValue)} 
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"> 
              <LuMessageCircle/> 
              </button>}
            </td>
          </tr>
          ))
          )}
        </tbody>
      </table>
    </div>
    {/* Modal */}
    {modalValue && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-lg min-w-[300px]">
          <h2 className="text-lg font-bold mb-2"> Melding fra {modalValue.sessionUser || "Uk-jent bruker"} </h2>
          <p className="mb-4"> {modalValue.userMessage|| "Ingen melding"}</p>
            <button title="modal"
            onClick={() => setModalState(null)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Lukk
            </button>
        </div>
      </div>
    )

    }

      <FooterDefault />
    </div>
  )
}
