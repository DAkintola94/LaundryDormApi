document.addEventListener("DOMContentLoaded", function () {
  fetch('layout.html')
      .then(response => response.text())
      .then(data => {
          document.getElementById('header-placeholder').innerHTML = data;
          setupMenuToggle(); // Call this function to set up the event listeners after content is loaded
      })
      .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
      });

  const getToken = localStorage.getItem('authToken');
  const getName = localStorage.getItem('userEmail');

  if (getName && getToken != null) {
      document.getElementById('emailField').value = getName; // Use .value instead of .innerHTML for input fields
  }
});