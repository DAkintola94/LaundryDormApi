import React from 'react'
import { CircleUserRoundIcon } from "lucide-react"
import {useFileUpload} from "../../hooks/use-file-upload"
import {Button} from "../../components/ui/button"
import {MdAlternateEmail, MdContactPhone, MdOutlineDriveFileRenameOutline} from 'react-icons/md'
import {FaAddressCard} from 'react-icons/fa'
import { TbLockPassword} from 'react-icons/tb'
import {useState} from 'react'
import { NavbarDefault } from "../NavbackgroundDefault/NavbackgroundDefault"
import { FooterDefault } from "../FooterDefault/FooterDefault"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const Register = () => {
    const [{files}, {removeFile, openFileDialog, getInputProps}] = 
    useFileUpload({
        accept: "image/*",
    })

    const previewUrl = files[0]?.preview || null;
    const fileName = files[0]?.file.name || null;

    const navigate = useNavigate(); //to navigate to a certain site

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    // Loads VITE_API_BASE_URL from the environment variables based on the current Vite mode.
    // if running in 'docker' mode, it uses variables from `.env.docker`; otherwise, it falls back to .env.local or .env.[mode].

    console.log("Backend API URL, docker mode:", import.meta.env.VITE_API_BASE_URL);

    const [firstName, regFirstName] = useState("");
    const [lastName, regLastName] = useState("");
    const [phoneNumber, regPhoneNr] = useState("");
    const [address, regAddress] = useState("");
    const [passWord, regPassword] = useState("");
    const [confirmPassWord, regConfirmPassword] = useState("");
    const [email, regEmail] = useState("");
    const [isPending, setBtnPending] = useState(false);
    const [errorMessage, setError] = useState('');

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

        
        //const registerData ={ //The left side need to match how the model is setup in backend/C#
                                //right side is what we get from our user/usestate
            //UserAddress: address,
            //Email: email,
            //Password: passWord,
            //ConfirmPassword: confirmPassWord,
            //UserFirstName: firstName,
            //UserLastName: lastName,
            //PhoneNumber: phoneNumber
        //};
        
        // Debug: Log the data being sent
        console.log("Sending registration data:", formData);
        
        try {
             const response = await axios.post(`${API_BASE_URL}/api/ProfileManagement/RegistrationAuth`, 
                formData, //Sending FormData, instead of JSON
        { 
            headers: {
                "Content-Type": "multipart/form-data" 
            },
        })
            const tokenResponse = response.data.jwtToken //Since we are getting json in response
            setBtnPending(false);

            localStorage.setItem("access_token", tokenResponse);
            navigate('/',
                {
                    replace: true
                }
            );
        }
        catch(err: unknown) {
            if(axios.isAxiosError(err) && err.response){
                const data = err.response.data;
              //if server respond with a status code outside of 2xx range

              let responseErrorMessage = "Noe gikk galt";
              setError(responseErrorMessage);

              if(data){
                if(Array.isArray(data.Errors)){
                    responseErrorMessage = data.Errors.join(",");
                } else if (typeof data.Errors === "string"){
                    responseErrorMessage = data.Errors;
                } else if (data.Message) {
                    responseErrorMessage = data.Message
                }
              }
                console.error('Backend respond status: ', err.response.status);

                setError(responseErrorMessage);
                setBtnPending(false);
            } else if(axios.isAxiosError(err) && err.request){
                setError("Ingen response fra serveren");
                setBtnPending(false);
            } else {
                setError("Noe gikk galt" + err);
                setBtnPending(false);
            }
        }
    } 

    return (
        <>
        <div className="register_loginBG"> {/* .register_loginBG is in global css*/}
            
        <form onSubmit={handleSubmit}>

        <div className="min-h-screen flex flex-col">
            <NavbarDefault />

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
                <input 
                    type="text" 
                    onChange={(evt) => regAddress(evt.target.value)} 
                    placeholder="stevnavn..." 
                    className="text-black bg-white mb-4 p-2 border rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required
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
        </>
    )
}