import React from 'react'
import { NavbarDefault } from './ApplicationComponent/NavbackgroundDefault/NavbackgroundDefault'
import { Settvask } from './ApplicationComponent/LaundryPages/Settvask'
import { Sidebar } from './ApplicationComponent/Pages/Sidebar'

export const Navigator = () => {
  return (
    <main className="flex min-h-screen w-full flex-col bg-slate-100 text-slate-900">
      <NavbarDefault />

      <section className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="min-h-0 w-full overflow-hidden border-b border-slate-200 bg-white lg:w-[55%] lg:border-b-0 lg:border-r">
          <Sidebar />
        </aside>

        <section className="min-h-0 w-full overflow-hidden bg-slate-950 lg:w-[45%]">
          <Settvask embedded hideNavbar hideFooter />
        </section>
      </section>
    </main>
  )
}
