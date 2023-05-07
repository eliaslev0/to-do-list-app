const logout_button = document.getElementById("logout");
logout_button.addEventListener("click", () => {
    console.log("registered click for logout");
    document.cookie = "userID=; Max-Age=0; path=/;";
    window.location.href = "http://localhost:3000/public/login.html";
  });