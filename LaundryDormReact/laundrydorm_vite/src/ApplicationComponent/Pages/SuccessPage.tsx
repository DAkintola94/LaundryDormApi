import React from 'react'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { MdError } from 'react-icons/md'
import { FaCheckCircle } from 'react-icons/fa'

export const SuccessPage = () => {
const location = useLocation(); //To get value passed from the usenavigate redirection in SettVask.tsx
const [successId] = useState<number | null>(location.state.ID);

  return (
    <>
    { !successId? ( <div className="flex items-center justify-center text-red-600 font-bold gap-2"> 
        < MdError className="text-1xl"/> 
        <span> Ingen vask er registrert, vennligst fyll ut dagen du vil sette vask </span>
        </div>

        ) : //else
          
      <div className="successPageBg">
        <div className="flex items-center justify-center font-bold gap-2 py-8"> 
        <FaCheckCircle className="text-1xl"/>
        <span> Vaskinformasjon ble opprettet og lagret. Vask ID: {successId} </span>
        </div>
      </div>
    }
    </>
  )
  
}
