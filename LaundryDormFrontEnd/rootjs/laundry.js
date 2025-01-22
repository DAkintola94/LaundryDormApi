const getLaundryData = document.querySelector('#btnPress');

getLaundryDataButton.addEventListener('click', getLaundryData);

function getLaundryData()
{
    fetch('http://localhost:5119/api/Home/LaundrySession')
    .then(response => {
        if(!response.ok) //if response is not ok
        {
            throw new Error('Network response was not ok');
        }

        return response.json(); //else, return response in json format
    })
    .then(data => {
        console.log(data); //log data to console, for debugging purposes
        displayLaundryData(data); // Call the function to display the data
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error); //log error to console
    });
}

function displayLaundryData(data){
const laundryList = document.querySelector('#laundryList'); //get the list element from the html file, # is for id

laundryList.innerHTML = ''; //clear any existing content in the list

data.ForEach(item => { //need to run loop since the backend is returning a list of items
    const listItem = document.createElement('li');

    //the content that will be displayed and also sent from the backend
    //the item variable we are receiving need to match the name in the model from the backend, needs to be camelcase in js
    listItem.textContent = `Laundry ID: ${item.sessionId}, User: ${item.personalID} Machine ID: ${item.machineId}, Machine Name ${item.machineName},
    Start Time: ${item.sessionStart}, End Time: ${item.sessionEnd}, Status: ${item.laundryStatusDescription}
    First Name: ${item.userFirstName}, Last Name: ${item.userLastName}, Email: ${item.email}
    Phone: ${item.phoneNr}, Reservation Time: ${item.reservationTime} Message: ${item.userMessage}`;

    laundryList.appendChild(listItem);

})

}