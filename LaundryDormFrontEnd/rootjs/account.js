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
const registrationForm = document.querySelector('#registrationForm');
const loginForm = document.querySelector('#loginForm');

if(registrationForm){
    registrationForm.addEventListener('submit', addRegistration);
}

if(loginForm){
    loginForm.addEventListener('submit', addLogin);
}

})


function addRegistration(event){
    event.preventDefault(); //preventing the default action of the form, which is to send the data to the server

    const body = { //body content need to match the model (name/style) in the backend
        UserAddress: document.getElementById("Address").value,
        UserName: document.getElementById("Username").value,
        Email: document.getElementById("Email").value,
        PhoneNumber: document.getElementById("PhoneNr").value,
        UserFirstName: document.getElementById("FirstName").value,
        UserLastName: document.getElementById("LastName").value,
        Password: document.getElementById("Password").value,
        ConfirmPassword: document.getElementById("ConfirmPassword").value
    };

    if(body.Password != body.ConfirmPassword){
        console.log("Password does not match");
        return;
    }

    fetch('http://localhost:5119/api/ProfileManagement/RegistrationAuth', {
        method: 'POST', //the CRUD method we are using, we are sending data in this case
        body: JSON.stringify(body), //converting the data content into a json format. They become camelcase during conversion
        headers:{
            'Content-Type': 'application/json' //specifing the data we are sending, json in this case
        }
    })

    .then(response =>{
        if(!response.ok)
             {
                throw new Error("Something went wrong: " + response.status);
             }

             return response.json();
    })
    .then(data => {
        console.log("Success, data sent: " + data);
        if(data.ok){
            console.log("Regristration successful");
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

}


// Login function
function addLogin(event){
    event.preventDefault();
    console.log("Login function called");

    const body = {
        Email: document.getElementById('Email').value,
        Password: document.getElementById('Password').value
    };

    console.log(body);

    fetch('http://localhost:5119/api/ProfileManagement/LoginAuth', {
        method: 'POST', //the CRUD method we are using, we are sending data in this case
        body: JSON.stringify(body), //converting the data content into a json format. They become camelcase during conversion
        headers:{
            'Content-Type': 'application/json' //specifing the data we are sending, json in this case
        }
    })

    .then(response =>{
        if(!response.ok)
             {
                throw new Error("Something went wrong: " + response.status);
             }

             return response.json();
    })
    .then(data => {
        console.log("Success, data sent: " + data);
        if(data.ok){
            console.log("Regristration successful");
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

}



