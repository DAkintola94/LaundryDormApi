import React from 'react'
import { useState } from 'react';
import { Status } from '../LaundryPages/Status'

export const Sidebar = () => {
    const [, setCalenderMode] = useState(true);
  return (
    <div className= "h-full w-full overflow-x-hidden">
        <p> This is a test</p>
            <Status calenderOnly={setCalenderMode} 
            
            />
    </div>
  )
}
