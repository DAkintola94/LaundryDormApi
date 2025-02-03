fetch('layout.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
    setupMenuToggle(); // Set up the event listeners after content is loaded
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });

  document.addEventListener("DOMContentLoaded", function(){
    const getDailyMessage = document.querySelector('#adminMessageForm');

    if(getDailyMessage){
        getDailyMessage.addEventListener('submit', sendDailyMessage);
    }


    function sendDailyMessage(event){
        event.preventDefault();

        const messageValue = {
            Message: document.getElementById('warningMessage').value,
            Name: document.getElementById('PersonalName').value
        }

        fetch('http://localhost:5119/api/Admin/DailyMessage', {
            method: 'POST',
            body: JSON.stringify(messageValue),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if(!response.ok){
                throw new Error("Error response: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("Error: " + error);
        })

    }

  });