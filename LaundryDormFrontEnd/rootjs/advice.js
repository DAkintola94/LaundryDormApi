fetch('layout.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
    setupMenuToggle(); // Set up the event listeners after content is loaded
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });

  document.addEventListener("DOMContentLoaded", function () {
    const adviceList = document.querySelector('#adviceForm');
    if (adviceList) {
        adviceList.addEventListener('submit', sendAdvice);
    }

    function sendAdvice(event) {
        event.preventDefault();

        const bodyElement = {
            AuthorName: document.getElementById("PersonalName").value,
            EmailAddress: document.getElementById("Email").value,
            categoryID: parseInt(document.getElementById("Category_option").value), // Ensure it's an integer
            InformationMessage: document.getElementById("Message").value
        };
        console.log(bodyElement);

        fetch('http://localhost:5119/api/Advice/AdviceFetcher', {
            method: 'POST', // The CRUD method we are using, we are sending data in this case
            body: JSON.stringify(bodyElement), // Converting the data content into a JSON format. They become camelCase during conversion
            headers: {
                'Content-Type': 'application/json' // Specifying the data we are sending, JSON in this case
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Something went wrong: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    }
});
