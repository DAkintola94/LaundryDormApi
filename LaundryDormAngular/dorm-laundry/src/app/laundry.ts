export interface Laundry {
    //creating the same structure as in the backend. 
    //Start with small letters and use camelCase because of Json convention

    laundrySessionId: number,
    userId: string,
    firstName: string,
    lastName: string,
    userEmail: string,

    phoneNumber: string,
    reservationTime: Date,
    message: string,
    laundryStatusID: number,
    


}