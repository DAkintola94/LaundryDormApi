import React from 'react'
import axios from "axios"
import {useState, useEffect} from 'react'
import { NavbarDefault } from '../NavbackgroundDefault/NavbackgroundDefault'
import { FooterDefault } from '../FooterDefault/FooterDefault'
import { Pagination } from '../Data_OperationComponent/Pagination'
import { LuMessageCircle } from 'react-icons/lu'
import { MdError } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'

export const Historic = () => {

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
  // Loads VITE_API_BASE_URL from the environment variables based on the current Vite mode.
  // if running in 'docker' mode, it uses variables from `.env.docker`; otherwise, it falls back to .env.local or .env.[mode].

  console.log("Backend API URL, docker mode:", import.meta.env.VITE_API_BASE_URL);

  const navigate = useNavigate();

  type UsersSessionHistoric = { //Setting the datatype of the data we will be getting from backend, and set to table in react. Remember, camelCase
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

  const [sort, setSort] = useState({keyToSort: 'Reservasjon dato', direction: 'asc'});

  const [modalValue, setModalState] = useState<UsersSessionHistoric | null>(null);
  const [userValidData, setData] = useState<UsersSessionHistoric[]>([]); //setting usestate to map object, as array. since .map only work with array
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(8);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchData = async () =>{
    await axios.get(`${API_BASE_URL}/api/Laundry/SessionHistoric?pageNumber=${currentPage}&pageSize=${postsPerPage}`,
      {
        headers: {"Authorization" : `Bearer ${token}`}
      })
    .then(response => {
       setData(response.data) //Axios puts the actual response data in the .data property of the response object.
       console.log(response.data);
      })                      //setting our populated data into the useState of userValidData [array]

      .catch(err => {
        console.log(err.message);
      })
    }
    if(token){
      fetchData();
    }
    else {
      const errMessage = "Unauthorize user";
      navigate('/error404', {
        replace: true,
        state: {
          errMessage: errMessage
        }
      })
    }
  }, [token, navigate, currentPage, postsPerPage, API_BASE_URL])


  {/*Sorting function*/}

  function handleHeaderClick(columnName: string){
    console.log('Row Click:', columnName);
    
    setSort(prevSort => ({
      keyToSort: columnName,
      direction: prevSort.direction === 'asc' ? 'desc' : 'asc'
    }));
  }

  const getSortedData = () => {
    const sortedData = [...userValidData].sort((a, b) => {
      const aValue = a[sort.keyToSort as keyof UsersSessionHistoric];
      const bValue = b[sort.keyToSort as keyof UsersSessionHistoric];

      //Handle null values
      if(aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if(bValue === null) return -1;

      //Convert to string for comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      const comparison = aStr < bStr ? -1 :aStr > bStr ? 1 : 0;
      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return sortedData
  };

  const sortedData = getSortedData();
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPost = sortedData.slice(firstPostIndex, lastPostIndex);



  return (
  <div className="min-h-screen flex flex-col">
        <NavbarDefault/>  
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-[1200px] mx-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
          <tr>
            <th scope="col" 
            className="px-6 py-3 cursor-pointer hover:bg-gray-100"
            onClick={() => handleHeaderClick('sessionUser')}
            > 
              Navn 
            </th>

            <th scope="col" 
            className="px-6 py-3 cursor-pointer hover:bg-gray-100"
            onClick={() => handleHeaderClick('sessionId')}
            >
             Vask ID
            </th>

            <th scope="col" 
            className="px-6 py-3 cursor-pointer hover:bg-gray-100"
            onClick={() => handleHeaderClick('reservationDate')}
            > 
            Reservasjon dato
            </th>

            <th scope="col" 
            className="px-6 py-3 cursor-pointer hover:bg-gray-100"
            onClick={() => handleHeaderClick('machineName')}
            >
              Maskin Navn
            </th>

            <th scope="col" 
            className="px-6 py-3 cursor-pointer hover:bg-gray-100"
            onClick={() => handleHeaderClick('startPeriod')}
            > 
            Start/Slutt 
            </th>

            <th scope="col" 
            className="px-6 py-3 cursor-pointer hover:bg-gray-100"
            onClick={() => handleHeaderClick('laundryStatusDescription')}
            >
            Status
            </th>

            <th scope="col" className="px-6 py-3">
               Melding
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
          currentPost?.map((rowValue, idx) => ( 
          <tr 
            key={idx} 
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {rowValue.sessionUser}
            </th>
            {/* currentPost = Array of items for the current page (created by .slice())
            .map() = Renders only the items for the current page (e.g., items 1-10, or 11-20, etc.)*/}

            <td className="px-6 py-4">
             {rowValue.sessionId}
            </td>

            <td className="px-6 py-4">
             {rowValue.reservationDate}
            </td>

            <td className="px-6 py-4">
             {rowValue.machineName}
            </td>

            <td className="px-6 py-4">
             {rowValue.startPeriod ? 
             format(parseISO(rowValue.startPeriod), 'HH:mm') 
             : 'N/A'
            } 
             - 
             {rowValue.endPeriod? 
            format(parseISO(rowValue.endPeriod), 'HH:mm') 
            : 'N/A'
            }
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
    {/* Pagination button at the end of the table */}
    <Pagination 
      totalPosts={sortedData.length}
      postsPerPage={postsPerPage}
      onPageChange={setCurrentPage}
      currentPage={currentPage}
      />

    {/* Modal */}
    {modalValue && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-lg min-w-[300px]">
          <h2 className="text-lg font-bold mb-2"> Melding fra {modalValue.sessionUser || "Uk-jent bruker"}: </h2>
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
