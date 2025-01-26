fetch('layout.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
    setupMenuToggle(); // Set up the event listeners after content is loaded
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });



document.addEventListener("DOMContentLoaded", function(){ // this is needed, we call when the page is loaded and ready to perform DOM manipulation
    const getDataThroughBtn = document.querySelector('#btnPress');
    const laundryList = document.querySelector('#laundryForm');
    const startDate_Time = document.querySelector("#StartTime");
    const endTime = document.querySelector("#EndTime");

    if(getDataThroughBtn){
        getLaundryData.addEventListener('click', getLaundryData);
    }

    //if(laundryList){
        //laundryList.addEventListener('click', displayLaundryData);
    //}

    if(laundryList){
        laundryList.addEventListener('submit', sendLaundryData);
    }
    
   
    
    if (startDate_Time && endTime) {
        // Adding the event listener for 'input' on startDate_Time
        startDate_Time.addEventListener('input', (event) => setEndTime(event, startDate_Time, endTime));
      }
    


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

function setEndTime() {
    // Ensure the start time has a value
    if (startDate_Time.value === "") {
      return;
    }

    // Parse the start time as a Date object
    const startTime = new Date(startDate_Time.value);

    // Add one hour to the start time
    startTime.setHours(startTime.getHours() + 2);

    // Set the end time value with the adjusted time (format it to 'yyyy-mm-ddThh:mm')
    endTime.value = startTime.toISOString().slice(0, 16);
  }


  function sendLaundryData(event){
    event.preventDefault();

    const sendBodyElement = {
        MachineId: parseInt(document.getElementById("MachineOption").value),
        SessionStart: document.getElementById("StartTime").value,
        SessionEnd: document.getElementById("EndTime").value,
        UserMessage: document.getElementById("Comment").value
    }

    console.log(sendBodyElement);
    fetch('http://localhost:5119/api/Laundry/StartSession',{
        method: 'POST',
        body: JSON.stringify(sendBodyElement),
        headers: {
            'Content-Type': 'application/json' //specifing the data we are sending, json in this case
        }
    })
    .then(response => {
        if(!response.ok){
            throw new Error("Something went wrong: " + response.status);
        }
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error("An error occured: ", error);
    })

    }
});