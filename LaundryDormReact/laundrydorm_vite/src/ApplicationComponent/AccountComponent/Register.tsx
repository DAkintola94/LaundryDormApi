import React from 'react'
import { CircleUserRoundIcon } from "lucide-react"
import {useFileUpload} from "../../hooks/use-file-upload"
import {Button} from "../../components/ui/button"
import {MdAlternateEmail, MdContactPhone, MdOutlineDriveFileRenameOutline} from 'react-icons/md'
import {FaAddressCard} from 'react-icons/fa'
import { TbLockPassword} from 'react-icons/tb'
import {useState, useEffect} from 'react'
import { NavbarDefault } from "../NavbackgroundDefault/NavbackgroundDefault"
import { FooterDefault } from "../FooterDefault/FooterDefault"
import { useNavigate } from 'react-router-dom'
import { registerApiCall } from "../../lib/authCall"
import { responseProps } from '../../lib/authCall'
import { GetAddressInformation } from '@/lib/addressCall'


import useDebounce from '@/lib/useDebounce'
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { IoSearch } from "react-icons/io5";
import { AddressResult } from '@/lib/addressCall'


export const Register = ({hideNavbar = false, hideFooter = false} : {hideNavbar? :boolean, hideFooter?: boolean}) => {
    const [{files}, {removeFile, openFileDialog, getInputProps}] = 
    useFileUpload({
        accept: "image/*",
    })

    const previewUrl = files[0]?.preview || null;
    const fileName = files[0]?.file.name || null;

    const navigate = useNavigate(); //to navigate to a certain site

    // Loads VITE_API_BASE_URL from the environment variables based on the current Vite mode.
    // if running in 'docker' mode, it uses variables from `.env.docker`; otherwise, it falls back to .env.local or .env.[mode].

    const [firstName, regFirstName] = useState("");
    const [lastName, regLastName] = useState("");
    const [phoneNumber, regPhoneNr] = useState("");
    const [address, regAddress] = useState("");
    const [passWord, regPassword] = useState("");
    const [confirmPassWord, regConfirmPassword] = useState("");
    const [email, regEmail] = useState("");
    const [isPending, setBtnPending] = useState(false);

    const [isSelecting, setIsSelecting] = useState(false);
    const [errorMessage, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<AddressResult[]>([]);
    const [selectedValue, setSelectedValue] = useState<AddressResult | null>(null);
    const debouncedSearch = useDebounce(address, 400)

    useEffect(() => {
    if (!debouncedSearch || isSelecting) return

    // SearchBar.tsx
    const getData = async () => {

      const results = await GetAddressInformation(debouncedSearch);
      if (results.length > 0) {
        setSuggestions(results);
        setOpen(true);
      } else {
        setSuggestions([]);
        setOpen(false);
      }
    };
    void getData();
  }, [debouncedSearch, isSelecting]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(passWord !== confirmPassWord){
            setError("Passordene matcher ikke");
            return;
        }

        setBtnPending(true);
        setError(""); // Clear any previous error

        if(!files || files.length === 0){
            setBtnPending(false);
            setError("Please, upload a profile picture");
            return;
        }

        const fileData = files[0]; 
        if(!fileData || !fileData.file){
            setError("Invalid file selected");
            setBtnPending(false);
            return;
        }

        const actualFile = fileData.file instanceof File ? fileData.file : null;
        if(!actualFile){
            setError("Please select a valid image file");
            setBtnPending(false);
            return;
        }

         // Create FormData for EVERYTHING (both user data AND file)
         //Remember that backend for this section takes both parameter as fromform
        const formData = new FormData();

        // Add user registration data as form fields
        formData.append('UserAddress', address);
        formData.append('Email', email);
        formData.append('Password', passWord);
        formData.append('ConfirmPassword', confirmPassWord);
        formData.append('UserFirstName', firstName);
        formData.append('UserLastName', lastName);
        formData.append('PhoneNumber', phoneNumber);

        // Add image data (matching your ImageViewModel)
        formData.append('File', actualFile);  // IFormFile File
        formData.append('FileName', actualFile.name);  // string FileName

        const regData: responseProps = await registerApiCall(formData);

        if(regData.success === true) {
            console.log(regData.successMessage);
            setBtnPending(false);
            navigate('/', { replace: true });
        } else {
        // Use errorMessage first (which now contains err.message from the catch block)
        // Fall back to errorObject.message if it exists, then generic message
            const errorMsg = regData.errorMessage 
            || (regData.errorObject?.message) 
            || "An error occurred";
        setError(errorMsg);
        setBtnPending(false);
        }
    } 

    return (
        <>
        {!hideNavbar && <NavbarDefault  />}
        <div className="register_loginBG"> {/* .register_loginBG is in global css*/}
            
        <form onSubmit={handleSubmit}>

        <div className="min-h-screen flex flex-col">

            <div className="flex-1 flex flex-col items-center justify-center py-8">

                {/* File upload component - FIXED LAYOUT */}
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="inline-flex items-center gap-3 align-top">
                        {/* Image preview container - SEPARATE from button */}
                        <div
                            className="relative flex w-12 h-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-gray-300 bg-white"
                            aria-label={
                                previewUrl ? "Preview of uploaded image" : "Default user avatar"
                            }
                        >
                            {previewUrl ? (
                                <img 
                                    className="w-full h-full object-cover"
                                    src={previewUrl}
                                    alt="Preview of uploaded image"
                                    width={48}
                                    height={48}
                                />
                            ) : (
                                <div aria-hidden="true">
                                    <CircleUserRoundIcon className="opacity-60 text-gray-400" size={20} />
                                </div>
                            )}
                        </div>

                        {/* Button container - SEPARATE from image, side by side */}
                        <div className="relative inline-block">
                            <Button 
                                type="button"
                                onClick={openFileDialog} 
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-haspopup="dialog"
                            >
                                {fileName ? "Bytt bilde" : "Profil bilde"}
                            </Button>
                            
                            <input
                                {...getInputProps()}
                                className="sr-only"
                                aria-label="Upload image file"
                                tabIndex={-1}
                            />
                        </div>
                    </div>

                    {/* File name display - BELOW the image/button area */}
                    {fileName && (
                        <div className="flex gap-2 text-xs items-center">
                            <p className="text-white truncate max-w-48" aria-live="polite">
                                {fileName}
                            </p>
                            <button
                                type="button"
                                onClick={() => removeFile(files[0]?.id)}
                                className="text-red-400 font-medium hover:underline focus:outline-none"
                                aria-label={`Remove ${fileName}`}
                            >
                                Fjern
                            </button>
                        </div>
                    )}
                </div>

                {/* Form fields */}
                <label className="text-white flex items-center gap-2">Fornavn <MdOutlineDriveFileRenameOutline /> </label>
                <input 
                    type="text" 
                    onChange={(evt) => regFirstName(evt.target.value)} 
                    placeholder="Ola..." 
                    className="text-black bg-white mb-4 p-2 border rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required
                />

                <label className="text-white flex items-center gap-2">Etternavn <MdOutlineDriveFileRenameOutline /> </label>
                <input 
                    type="text" 
                    onChange={(evt) => regLastName(evt.target.value)} 
                    placeholder="Nordman..." 
                    className="text-black bg-white mb-4 p-2 border rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required
                />

            <label className="text-white flex items-center gap-2">Addresse <FaAddressCard />  </label>
                <Autocomplete aria-required={true}
                className="text-black bg-white mb-4  border rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                freeSolo
                open={open && suggestions.length > 0}
                onClose={() => setOpen(false)}
                inputValue={address}
                // onInputChange Fires when you type in the input field. Use this to update your search state.
                onInputChange={(_, value, reason) => {
                if (reason === "input") {
                    regAddress(value);
                    setIsSelecting(false);
                    setSelectedValue(null);
                }
                }}
                value={selectedValue}
                // onChange Fires when you select an option from the dropdown. Use this to finalize the selection.
                onChange={(_, value) => {
                if (typeof value === "string") {
                    regAddress(value);
                    setSelectedValue(null);
                    setIsSelecting(true);
                    setOpen(false);
                    return;
                }
                setSelectedValue(value);
                regAddress(value?.addressName ?? "");
                setIsSelecting(true);
                if (value) {
                    regAddress(value.addressName + ", " + value.postnummer);

                }
                setOpen(false);
                }}
                options={suggestions}
                getOptionLabel={(option) =>
                typeof option === "string"
                    ? option
                    : `${option.addressName}, ${option.postnummer}`
                }
                isOptionEqualToValue={(option, value) => {
                if (typeof option === "string" || typeof value === "string") return false;
                return option.addressName === value.addressName && option.postnummer === value.postnummer;
                }}
                renderInput={(params) => (
                <TextField 
                    {...params}
                    size="small"
                    autoComplete="off"
                    sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#ffffff' }, '& .MuiInputLabel-root': { color: '#666' } }}
                />
                )}
            />

                <label className="text-white flex items-center gap-2" >Email <MdAlternateEmail /> </label>
                <input 
                    type="email" 
                    onChange={(evt) => regEmail(evt.target.value)} 
                    placeholder="laundrydorm@live.no" 
                    className="text-black bg-white mb-4 p-2 border rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required
                />

                <label className="text-white flex items-center gap-2">Telefon <MdContactPhone /> </label>
                <input 
                    type="text" 
                    onChange={(evt) => regPhoneNr(evt.target.value)} 
                    placeholder="+4712345678" 
                    className="text-black bg-white mb-4 p-2 border rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    maxLength={8} 
                    required
                />

                <label className="text-white flex items-center gap-2">Passord <TbLockPassword />   </label>
                <input 
                    type="password" 
                    onChange={(evt) => regPassword(evt.target.value)} 
                    placeholder="Min 1 stor bokstav" 
                    className="text-black bg-white mb-4 p-2 border rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required
                />
                
                {errorMessage && (
                    <span className="text-red-400 mb-4"> {errorMessage}</span>
                )}

                <label className="text-white flex items-center gap-2">Bekreft passord <TbLockPassword />   </label>
                <input 
                    type="password" 
                    onChange={(evt) => regConfirmPassword(evt.target.value)} 
                    placeholder="Min 1 stor bokstav" 
                    className="text-black bg-white mb-4 p-2 border rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required
                />

                {!isPending && (
                    <button 
                        type="submit" 
                        className="mb-4 p-2 border rounded w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Registrer
                    </button>
                )}
                
                {isPending && (
                    <button 
                        disabled 
                        className="mb-4 p-2 border rounded w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center"
                    >
                        {isPending ? (
                            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                        ) : (
                            <span className="w-5 h-5 mr-3" /> // invisible spacer
                        )}
                        Vennligst vent
                    </button>
                )}

            </div>
            <FooterDefault />
        </div>

        </form>

        </div>
        {!hideFooter && <FooterDefault />}
        </>
    )
}