fetch('layout.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
    setupMenuToggle(); // Set up the event listeners after content is loaded
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });

  const getToken = localStorage.getItem("authToken");
  console.log(getToken + "is the token");

  document.addEventListener("DOMContentLoaded", function(){

    const reservationScheme = document.querySelector("#reservationForm");

    if(reservationScheme) {
        reservationScheme.addEventListener('submit', sendReservationData);
    }

    function sendReservationData(event){
        event.preventDefault();
        const reservationBody = {
            ReservationDate: document.getElementById("dateSet").value,
            ReservationPeriodTime: document.getElementById("ReservationOpt").value,
            Name: document.getElementById("PersonId").value,
            MachineRoom: document.getElementById("machineRoomId").value
        }

        fetch('http://localhost:5119/api/Laundry/SetReservation', {
            method: 'POST',
            body: JSON.stringify(reservationBody),
            headers:{
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken}`
            }
        })

        .then(response => { //then getting response from the backend
            if(!response.ok){ //if the response is not ok
                throw new Error("Error response: " + response.status);
            }

            return response.json(); //else, return the response in json format
            //needed or else we get "undefined" since it cant be read
        })

        .then(data => {
            console.log(data);
            //document.getElementById('responseBody').innerHTML = data;
        })

        .catch(error => {
            console.error("Error: " + error);
        })
    }
  });