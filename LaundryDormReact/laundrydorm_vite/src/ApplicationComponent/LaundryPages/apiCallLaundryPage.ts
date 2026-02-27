
import axios from "axios";

export type UsersSessionHistoric = { //Setting the datatype of the data we will be getting from backend, and set to table in react. Remember, camelCase
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


export interface callbackStates{ //Creating void interface, so we can send several callbacks to the user
    setSessionHistoric: (valuesFromDb: UsersSessionHistoric[]) => void
    setLoadingBtn: (show: boolean) => void
    setErrorMessage: (messageFromBackend: string) => void
}

export interface setLaundryCallbacks{ //Creating void interface, so we can send several callbacks to the user
    setFormName: (formName: string) => void
    setFormEmail: (formEmail: string) => void
    setPhoneNumber: (phoneNr: string) => void
    setError: (messageFromBackend: string) => void
}

export interface sessionProps {
    userMessage: string,
    machineId: number,
    sessionTimePeriodId: number,
    reservationTime: string
}

export async function getHistoricData(baseUrl: string ,callBack: callbackStates,
     currentPageShown: number, currentPostsPerPage: number)
     : Promise<void> //What the method promise to return, and it must be a void in this case
     {
    const token = localStorage.getItem("access_token");
    if (!token) {
        callBack.setLoadingBtn(false); //send the loading as false, through the callback
        return callBack.setErrorMessage("An error occured");
    } 
    try{
        const fetchData = await axios.get(`${baseUrl}/api/Laundry/SessionHistoric?pageNumber=${currentPageShown}&pageSize=${currentPostsPerPage}`,
        {
            headers: {"Authorization": `Bearer ${token}`}
        });
    console.log("Historic data from the backend: ", fetchData.data);
    callBack.setSessionHistoric(fetchData.data);
    callBack.setLoadingBtn(false);
    }
    catch(err: unknown){
        if(axios.isAxiosError(err) && err.response){
            const errorData = err.response.data;
            console.log(errorData)
            let responseErrorMessage
            callBack.setLoadingBtn(false);

            if(errorData){
                if(Array.isArray(errorData.Errors)){
                    responseErrorMessage = errorData.Errors.join(",");
                    callBack.setLoadingBtn(false);
                    callBack.setErrorMessage(responseErrorMessage);
                } else if (typeof errorData.Errors === "string"){
                    responseErrorMessage = errorData.Errors;
                    callBack.setLoadingBtn(false);
                    callBack.setErrorMessage(responseErrorMessage);
                } else if (errorData.Message){
                    responseErrorMessage = errorData.Message
                    callBack.setLoadingBtn(false);
                    callBack.setErrorMessage(responseErrorMessage);
                }
            }

            //callBack.errorMessage(errorData);
        } else if (axios.isAxiosError(err)){
            callBack.setLoadingBtn(false);
            callBack.setErrorMessage(err.message);
        }
               //Else        
            callBack.setErrorMessage("An error occured")
            callBack.setLoadingBtn(false);
    }
    
}

export async function setLaundryCall(API_BASE_URL: string, laundrySessionData: sessionProps)
:Promise<string | undefined>
{
    const token = localStorage.getItem("access_token");
    if(!token) return "undefined"
    try{
        const sendData = await axios.post(`${API_BASE_URL}/api/Laundry/StartSession`,
            laundrySessionData,    
        {
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

        })

        const responseData: string = sendData.data.backendSessionId; //backend is sending back that variable name "backendSessionId"
        if(!responseData) return "undefined"
        console.log(responseData);
        
        return responseData
    }
    catch{
        console.log("An error occured");
    }
}