const setupMenuToggle = () => {
  const hamMenu = document.querySelector(".ham-menu");
  const offScreenMenu = document.querySelector(".off-screen-menu");

  if (hamMenu && offScreenMenu) {
    hamMenu.addEventListener("click", () => {
      hamMenu.classList.toggle("active");
      offScreenMenu.classList.toggle("active");
    });
  }
};

document.addEventListener("DOMContentLoaded", function () {
  setupMenuToggle(); // Call this function to set up the event listeners after the DOM is fully loaded

  const logOut = document.getElementById("logout-btn");
  const getToken = localStorage.getItem("authToken");
  const userEmail = localStorage.getItem("userEmail");

  if(getToken != null && logOut){
    logOut.addEventListener("click", logOutUser);
  }

  console.log(getToken);
  console.log(userEmail);
  
  
    if(getToken && userEmail != null){

      const nav_dropDownReg = document.getElementById("reg");
      nav_dropDownReg.textContent = userEmail;
      nav_dropDownReg.href = "home.html"; // Display the user email in the navigation bar

      const nav_logIn = document.getElementById("logIn");
      nav_logIn.style.display = "none";
    }

    else{
      console.error("Error, Something went wrong ");
    }

    function logOutUser(event){
      event.preventDefault();

      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      window.location.href = "home.html";
    }

});