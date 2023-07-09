function checkToken() {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = decodeToken(token);
    const expirationTime = decodedToken.exp * 1000;
    const currentTime = Date.now();
    
    if (currentTime > expirationTime) {
      redirectToLogin();
      alert("Your session has expired. Please log in again.");
    }
  } else {
    redirectToLogin();;
  }
}

function redirectToLogin() {
  window.location.href = "./login.html";
}

function decodeToken(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
