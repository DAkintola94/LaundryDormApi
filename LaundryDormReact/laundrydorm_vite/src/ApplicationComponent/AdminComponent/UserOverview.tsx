import React from 'react'
import { NavbarDefault } from '../NavbackgroundDefault/NavbackgroundDefault'
import { FooterDefault } from '../FooterDefault/FooterDefault'
import { useState, useEffect } from 'react'
import { LuMessageCircle } from 'react-icons/lu'
import { MdError } from 'react-icons/md'
import axios from 'axios'
import { IoIosInformationCircle } from 'react-icons/io'

export const UserOverview = () => {

type UserOverview = {
    email: string | null;
    userFirstName: string | null;
    userLastName: string | null; 
    phoneNumber: string | null;
    profileId: string | null;
    userAddress: string | null;
};

const[modalValue, setModalState] = useState<UserOverview | null>(null);
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
      <div className="relativ overflow-x-auto shadow-md sm:rounded-lg w-[1200px] mx-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Førstenavn
              </th>

              <th scope="col" className="px-6 py-3">
                Etternavn
              </th>

              <th scope="col" className="px-6 py-3">
                Email
              </th>

              <th scope="col" className="px-6 py-3">
                Telefon nr
              </th>

              <th scope="col" className="px-6 py-3">
                ID
              </th>

              <th scope="col" className="px-6 py-3">
                <LuMessageCircle />
              </th>
            </tr>
          </thead>

          <tbody>
            {!token || usersData.length === 0 ? (
            <tr>
              <td colSpan={7}>
                <div className="flex items-center justify-center text-red-600 font-bold gap-2">
                  <MdError className="text-1x1" />
                  <span> Ingen informasjon tilgjengelig</span>
                </div>
              </td>
            </tr>  
            ) : (
              usersData?.map((rowElement, idx) => (
                <tr key={idx} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {rowElement.userFirstName}
                  </th>

                  <td className="px-6 py-4">
                    {rowElement.userLastName}
                  </td>

                  <td className="px-6 py-4">
                    {rowElement.email}
                  </td>

                  <td className="px-6 py-4">
                    {rowElement.phoneNumber}
                  </td>

                  <td className="px-6 py-4">
                    {rowElement.profileId}
                  </td>

                  <td className="px-6 py-4 text-right">
                    {
                      <button title="modal"
                      onClick={() => setModalState(rowElement)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
                        <IoIosInformationCircle />
                        <span> Mer handling</span>
                      </button>
                    }
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      {modalValue && (
        <div className="fixed insert-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h2 className="text-lg font-bold md-4"> Velg handling </h2>
            <div className="space-y-2 md-4">
              <p><strong>Navn:</strong>{modalValue.userFirstName || "Ikke oppgitt"} {modalValue.userLastName || "ikke oppgitt"} </p>
              <p><strong>Addresse:</strong>{modalValue.userAddress || "Ikke oppgitt"}</p>
            </div>
            <button
            >
              Slett bruker
            </button>

            <button
            onClick={() => setModalState(null)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Lukk
            </button>
          </div>

        </div>
      )}

      <FooterDefault />
    </div>

  )
}
