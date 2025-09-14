import React from 'react'
import { NavbarDefault } from '../NavbackgroundDefault/NavbackgroundDefault'
import { FooterDefault } from '../FooterDefault/FooterDefault'
import { useState, useEffect } from 'react'
import { RiAdminFill } from 'react-icons/ri'
import { MdError } from 'react-icons/md'
import { FaUserLock } from 'react-icons/fa'
import axios from 'axios'
import { IoIosInformationCircle } from 'react-icons/io'

export const UserOverview = () => {

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
    // Loads VITE_API_BASE_URL from the environment variables based on the current Vite mode.
    // if running in 'docker' mode, it uses variables from `.env.docker`; otherwise, it falls back to .env.local or .env.[mode].

    console.log("Backend API URL, docker mode:", import.meta.env.VITE_API_BASE_URL);

type UserOverview = {
    email: string | null;
    firstName: string | null;
    lastName: string | null; 
    phoneNumber: string | null;
    id: string | null;
    address: string | null;
};


const[modalValue, setModalState] = useState<UserOverview | null>(null);
const[usersData, setUsersData] = useState<UserOverview[]>([]); //setting usestate to map object, as array. since .map only work with array
const[loading, setLoading] = useState(false);
const token = localStorage.getItem("access_token");
const [adminError, setAdminError]=useState<string | null>(null)


useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    await axios.get(`${API_BASE_URL}/api/Admin/UsersOverview`,
      {
        headers: {"Authorization" : `Bearer ${token}`}
      })
      .then(response => {
        setUsersData(response.data);
        //console.log(response.data, "This is the data");
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
        setLoading(false);
        console.log("Unauthorized user");
        setAdminError("Vennligst logg inn med admin bruker");
      }
}, [token, API_BASE_URL])


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
                <RiAdminFill />
              </th>

            </tr>
          </thead>

          <tbody>
            { loading ? (
              <tr>
                <td colSpan={7}>
                  <div className="flex items-center justify-center text-blue-600 font-bold gap-2">
                  <img src="../../assets/spinloading.svg" title='Loading image' className="h-[5vh] w-[5vh]" />
                  <span> Henter data </span>
                  </div>
                </td>
              </tr>
            ) : 

            !token || adminError ? (
              <tr>
                <td colSpan={7}>
                  <div className="flex items-center justify-center text-yellow-600 font-bold gap-2">
                    <FaUserLock className="text-1xl" />
                    <span> {adminError} </span>
                  </div>
                </td>
              </tr>
            ) :
            
            usersData.length === 0 ? (
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
                  <th scope="row" className="px-6 py-4 font-bold">
                    {rowElement.firstName}
                  </th>

                  <td className="px-6 py-4 font-bold">
                    {rowElement.lastName}
                  </td>

                  <td className="px-6 py-4 text-black">
                    {rowElement.email}
                  </td>

                  <td className="px-6 py-4 text-black">
                    {rowElement.phoneNumber}
                  </td>

                  <td className="px-6 py-4 text-black">
                    {rowElement.id}
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
              <p><strong>Navn:</strong>{modalValue.firstName || "Ikke oppgitt"} {modalValue.lastName || "ikke oppgitt"} </p>
              <p><strong>Addresse:</strong>{modalValue.address || "Ikke oppgitt"}</p>
            </div>
            <button className="py-2"
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
