import { getCookie, getAccessTokenWithRefreshToken } from "./tokenUtils.js";

document.addEventListener("DOMContentLoaded", function () {
  const accessToken = getCookie("access_token");
  if (accessToken) {
    window.location.href = "./main.html";
  }
});
