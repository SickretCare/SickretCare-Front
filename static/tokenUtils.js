const API_SERVER_DOMAIN = "http://3.36.216.93:8000/";

// 쿠키에서 특정 이름의 값을 가져오는 함수
function getCookie(name) {
  var nameEQ = name + "=";
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
}

// 리프레시 토큰을 사용하여 새로운 액세스 토큰을 가져오는 함수
function getAccessTokenWithRefreshToken(refreshToken) {
  if (!refreshToken) {
    return Promise.reject(new Error("Refresh token is missing"));
  }

  return fetch(API_SERVER_DOMAIN + "/users/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to refresh access token");
      }
      return response.json();
    })
    .then((data) => {
      return data.access_token;
    });
}

// 모듈을 외부에서 사용할 수 있도록 export
export { getCookie, getAccessTokenWithRefreshToken };
