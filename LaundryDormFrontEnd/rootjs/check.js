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
    const getDataThroughBtn = document.querySelector("#checkForm");
    if(getDataThroughBtn){
        getDataThroughBtn.addEventListener('submit', checkAvailability);
    }

    function checkAvailability(event){
        event.preventDefault();
        const sendDate = {
            DateOfTime: document.querySelector("#dateSet").value
        }

        fetch('http://localhost:5119/api/Home/DateAvailability', {
            method: 'POST',
            body: JSON.stringify(sendDate),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if(response.ok){
                return response.json();
                // returning the response in json format, from the backend
                //needed or else we get "undefined" since it cant be read
            }

            else{
                throw new Error('Network response was not ok');
            }
        })
        .then(data => {
            //data is the actual response we get from the backend, after the promises are resolved

            document.getElementById('info_area').innerHTML = data + "er reservert";
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });

    }



  });