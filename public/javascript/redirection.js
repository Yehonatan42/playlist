function logout() {
  localStorage.removeItem("token");

  window.location.href = "/login.html";
}

function main() {
  window.location.href = "/main.html";
}