import { NavbarDefault } from '../NavbackgroundDefault/NavbackgroundDefault'
import { FooterDefault } from '../FooterDefault/FooterDefault'
import { useState, useEffect } from 'react'
import { globalUserProfileData } from '@/lib/authCall'

export const Profile = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  // Loads VITE_API_BASE_URL from the environment variables based on the current Vite mode.
  // if running in 'docker' mode, it uses variables from `.env.docker`; otherwise, it falls back to .env.local or .env.[mode].

  const token = localStorage.getItem('access_token')
  const [loading, setLoading] = useState(false);

  const [userFirstName, setFirstName] = useState("");
  const [userLastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profile_id, setId] = useState("");
  const [usersEmail, setEmail] = useState("");
  const [usersAddress, setAddress] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [fetchError, setFetchError] = useState('');



  useEffect(() => {
    const fetchData = async() => {
      setLoading(true);
      await globalUserProfileData( //Void promise, we cant enter methods property, it gives use value based on logics
        API_BASE_URL,
        { //Setting all useState that will be used, its a void function, but a usestate here
          setFirstName,
          setLastName,
          setId,
          setEmail,
          setPhoneNumber,
          setAddress,
          setImageUrl,
          setLoading,
          setFetchError
        }
      );
    }
    if(token){
      fetchData();
    } 
    return
  },[token, API_BASE_URL] )

  return (
    <>
      <NavbarDefault />
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7ed,_#ffedd5_35%,_#fff_80%)] px-4 py-8">
        <section className="mx-auto w-full max-w-5xl">
          <div className="mb-6 rounded-3xl border border-orange-100/80 bg-white/80 p-6 shadow-[0_14px_40px_rgba(251,146,60,0.18)] backdrop-blur sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">LaundryDorm</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Min profil</h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">Hold kontaktopplysningene dine oppdatert slik at vaskevarsler når deg raskt</p>
          </div>

          {loading ? (
            <div className="flex min-h-[35vh] items-center justify-center rounded-3xl border border-orange-100 bg-white/80 p-6 shadow-lg">
              <div className="flex items-center gap-3 text-orange-600">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-300 border-t-orange-600" />
                <span className="text-base font-semibold">Vennligst vent...</span>
              </div>
            </div>
          ) : fetchError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 shadow-sm">
              <p className="font-semibold">Could not load profile data</p>
              <p className="mt-1 text-sm">{fetchError}</p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
              <aside className="rounded-3xl border border-orange-100 bg-white p-6 shadow-lg">
                <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-orange-200 bg-orange-50 text-3xl font-bold text-orange-600">
                  {imageUrl ? (
                    <img title="profile_image" src={imageUrl} className="h-full w-full object-contain" />
                  ) : (
                    <span>{(userFirstName.charAt(0) + userLastName.charAt(0)).toUpperCase() || '?'}</span>
                  )}
                </div>
                <h2 className="mt-4 text-center text-2xl font-bold text-slate-900">{userFirstName} {userLastName}</h2>
                <p className="text-center text-sm text-slate-500">Profil ID: {profile_id || 'Not available'}</p>
              </aside>

              <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-lg sm:p-8">
                <h3 className="text-xl font-semibold text-slate-900">Bruker informasjon</h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <article className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
                    <p className="mt-1 break-words text-sm font-medium text-slate-900">{usersEmail || 'No email found'}</p>
                  </article>

                  <article className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Telefon nr</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{phoneNumber || 'No phone number found'}</p>
                  </article>

                  <article className="rounded-xl border border-slate-100 bg-slate-50 p-4 sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Addresse</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{usersAddress || 'No address found'}</p>
                  </article>
                </div>
              </section>
            </div>
          )}
        </section>
      </main>
      <FooterDefault />
    </>
  )
}
