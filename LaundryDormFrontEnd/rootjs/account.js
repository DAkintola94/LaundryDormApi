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

    const registrationForm = document.querySelector('#registrationForm');
    const loginForm = document.querySelector('#loginForm');

    if (registrationForm) {
        registrationForm.addEventListener('submit', userRegistration);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }


async function userRegistration(event) {
    event.preventDefault(); // Prevent default form submission

    const registrationValidation = {
        UserAddress: document.getElementById("Address").value,
        UserName: document.getElementById("Username").value,
        Email: document.getElementById("Email").value,
        PhoneNumber: document.getElementById("PhoneNr").value,
        UserFirstName: document.getElementById("FirstName").value,
        UserLastName: document.getElementById("LastName").value,
        Password: document.getElementById("Password").value,
        ConfirmPassword: document.getElementById("ConfirmPassword").value
    };

    if (registrationValidation.Password !== registrationValidation.ConfirmPassword) {
        console.log("Passwords do not match.");
        return;
    }

   const response = await fetch('http://localhost:5119/api/ProfileManagement/RegistrationAuth', {
        method: 'POST',
        body: JSON.stringify(registrationValidation), // Convert JavaScript object to JSON string
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(!response.ok){ 
        const errorMessage = await response.text();
        console.log("Registration failed: ", errorMessage);
        //const errorMessage = `Registration failed: ${response.status}`;
        //window.location.href = `404.html?error=${encodeURIComponent(errorMessage)}`; // Redirecting to 404 page and passing error message to it

        throw new Error("Login failed: ");
    }


    const tokenData = await response.text();
    localStorage.setItem('authToken', tokenData);
    console.log("Token received:", tokenData);

    window.location.href = 'home.html'; // Redirect to home page
}

async function loginUser(event) { //async instead of promise chaining
    event.preventDefault();

    const usersValidation = {
        Email: document.getElementById("UsersEmail").value,
        Password: document.getElementById("UsersPassword").value
    };

    const response = await fetch('http://localhost:5119/api/ProfileManagement/LoginAuth', {
        method: 'POST',
        body: JSON.stringify(usersValidation),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {

        console.log("Login failed: ", response);
        window.location.href = "404.html";  // Redirecting to 404 page
        throw new Error("Login failed: " + response.status);
        
    }

    const tokenData = await response.text(); // JWT is a plain text string
    localStorage.setItem('authToken', tokenData);
    localStorage.setItem('userEmail', usersValidation.Email);


    console.log("Token received:", tokenData);

    window.location.href = 'home.html'; // Redirect to home page
    
}

});
