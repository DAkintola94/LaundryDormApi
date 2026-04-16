import React from 'react'
import { useState } from 'react';
import { Status } from '../LaundryPages/Status'

export const Sidebar = () => {
    const [, setCalenderMode] = useState(true);
  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden p-4 sm:p-6 text-slate-900">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Sidebar</p>
            <Status calenderOnly={setCalenderMode} embedded />
    </div>
  )
}
