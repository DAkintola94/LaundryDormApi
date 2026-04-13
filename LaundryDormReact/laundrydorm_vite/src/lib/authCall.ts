import axios from "axios";
import { getValidAccess } from "./authExpire";

 export interface responseProps{ //exporting the interface so we can use the datatype elsewhere
    success: boolean | undefined
    successMessage: string | undefined
    errorMessage: string | undefined ,
    errorObject: any | undefined
 }

 export interface profileProps{
    imageUrl: string | undefined
    error: string | undefined
    userName: string | undefined
    phoneNr: string | undefined
    email: string | undefined
    //address: string | undefined
 }

 export interface valueCallbacks{
    setFirstName: (name: string) => void, //setFirstName is a function that takes a string and returns nothing
    setLastName: (lastName: string) => void
    setId: (userId: string) => void
    setEmail: (email: string) => void
    setPhoneNumber: (phoneNr: string) => void
    setAddress: (address: string) => void
    setImageUrl: (imageUrl: string) => void
    setLoading: (loadingState: boolean) => void //setLoading is a function that takes a boolean and returns nothing
    setFetchError: (errorMessage: string) => void
 }

  export async function globalFetchData(API_BASE_URL: string):
 Promise<profileProps>
 {
    try{
         const validToken = getValidAccess(); //callback hook/funtion that returns token is its not expired, and it exist

        const getProfileInfo = await axios.get(`${API_BASE_URL}/api/ProfileManagement/AuthenticateUser`,
            {
                headers: {"Authorization" : `Bearer ${validToken}`}
            }
        ) 
        return {
            imageUrl: getProfileInfo.data.profilePictureUrlPath,
            error: undefined,
            userName: getProfileInfo.data.userName,
            phoneNr: getProfileInfo.data.phoneNumber,
            email: getProfileInfo.data.email,
            //address: undefined

        }
    }

    catch {
        return {
            imageUrl: undefined,
            error: "An error occured",
            userName: undefined,
            phoneNr: undefined,
            email: undefined,
            //address: undefined
        }
    }
 }

 export async function globalUserProfileData(API_BASE_URL: string, callbackValues: valueCallbacks)
 : Promise<void>{
    try{
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`${API_BASE_URL}/api/ProfileManagement/ProfilePage`,
            {
                headers: {"Authorization" : `Bearer ${token}`}
            })
           if(!response) return callbackValues.setLoading(false);
           console.log(response, "for the profile page");
        callbackValues.setFirstName(response.data.userFirstName);
        callbackValues.setLastName(response.data.userLastName);
        callbackValues.setId(response.data.profileId);
        callbackValues.setEmail(response.data.email);
        callbackValues.setPhoneNumber(response.data.phoneNumber);
        callbackValues.setAddress(response.data.userAddress);
        callbackValues.setImageUrl(response.data.userImageURL);
        callbackValues.setLoading(false);
    } catch {
        callbackValues.setFetchError("An error occured");
        callbackValues.setLoading(false);
    }
 }


 export async function registerApiCall(formData: FormData): 
 Promise<responseProps>
 {
     try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
            // Loads VITE_API_BASE_URL from the environment variables based on the current Vite mode.
            // if running in 'docker' mode, it uses variables from `.env.docker`; otherwise, it falls back to .env.local or .env.[mode].

             const response = await axios.post(`${API_BASE_URL}/api/ProfileManagement/RegistrationAuth`, 
                formData, //Sending FormData, instead of JSON
        { 
            headers: {
                "Content-Type": "multipart/form-data" 
            },
        })
            console.log(formData);
            const tokenResponse = response.data.jwtToken //Since we are getting json in response
            localStorage.setItem("access_token", tokenResponse);
            return {
                success: true,
                successMessage: "Registration successful",
                errorMessage: undefined,
                errorObject: undefined
            }
        }
        catch(err: unknown) {
            if(axios.isAxiosError(err) && err.response){
                const errorData = err.response.data;
              //if server respond with a status code outside of 2xx range

              let responseErrorMessage 

              if(errorData){
                if(Array.isArray(errorData.Errors)){
                    responseErrorMessage = errorData.Errors.join(",");
                } else if (typeof errorData.Errors === "string"){
                    responseErrorMessage = errorData.Errors;
                } else if (errorData.Message) {
                    responseErrorMessage = errorData.Message
                }
                return {
                    success: false,
                    successMessage: "An error occured",
                    errorObject: errorData,
                    errorMessage: "An error occured"
                }
              }
                console.error('Backend respond status: ', err.response.status);
                console.log(responseErrorMessage);
                //errorMsg(responseErrorMessage);
            } else if(axios.isAxiosError(err)){
                return {
                    success: false,
                    successMessage: "An error occured",
                    errorObject: err.message,
                    errorMessage: "No message from the server"
                }
            } else {
                console.log("An error occured");
            }

             return {
                    success: false,
                    successMessage: "An error occured",
                    errorObject: err,
                    errorMessage: "No message from the server"
                }
        }
 }

 export async function loginCall (formData: FormData):
 Promise<responseProps> //Returning a promise, in this case, the promise is the interface we setup to attach datatypes
 {
    try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
        // Loads VITE_API_BASE_URL from the environment variables based on the current Vite mode.
        // if running in 'docker' mode, it uses variables from `.env.docker`; otherwise, it falls back to .env.local or .env.[mode].

        const response = await axios.post(`${API_BASE_URL}/api/ProfileManagement/LoginAuth`, 
            formData, //This is the body, axios automatically JSON-stringifies the request body, no need to json.stringify
        {
            headers: {
                "Content-Type": "application/json"
            },
        }) 
        console.log(API_BASE_URL, "the url");
        const tokenResponse = response.data
        localStorage.setItem("access_token", tokenResponse);

        return {
            success: true,
            successMessage: "Login successful",
            errorMessage: undefined,
            errorObject: undefined
        }
    }
    catch(err){
         return {
            success: false,
            successMessage: "An error occured",
            errorMessage: undefined,
            errorObject: err
        }
    }

 }

 

    
