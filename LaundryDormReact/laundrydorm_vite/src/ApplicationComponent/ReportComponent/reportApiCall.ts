import axios from "axios";


export async function postReportForm(){
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const sendData = await axios.post(`${API_BASE_URL}/api/Advice/AdviceFetcher`, {

})

}