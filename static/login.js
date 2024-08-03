//set cookie, get cookie 함수 생성
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

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

document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.querySelector(".login-btn");
  const emailInput = document.querySelector('input[type="email"]');
  const passwordInput = document.querySelector('input[type="password"]');
  const loginMsg = document.getElementById("login-msg");

  const API_SERVER_DOMAIN = 'http://3.36.216.93:8000/';

  loginMsg.style.display = "none";

  loginBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (email !== "" && password !== "") {
      try {
        const response = await fetch(API_SERVER_DOMAIN + 'users/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.status === 200) {
          //로그인 성공
          // 로그인 성공: 쿠키에 토큰 저장
          setCookie('access_token', result.access_token, 7);
          setCookie('refresh_token', result.refresh_token, 7);
          console.log('로그인 성공:', result);
          window.location.href = './main.html';
        } else if (response.status === 401) {
          //비밀번호가 틀리면
          loginMsg.textContent = '비밀번호가 틀렸습니다.';
          loginMsg.style.display = 'block';
        } else if (response.status === 404) {
          //이메일로 가입된 계정이 없으면
          loginMsg.textContent = '이메일로 가입된 계정이 없습니다.';
          loginMsg.style.display = 'block';
        } else {
          //다른 이유
          loginMsg.textContent = '알 수 없는 오류가 발생했습니다.';
          loginMsg.style.display = 'block';
        }
      } catch (error) {
        console.error('Error:', error);
        loginMsg.textContent = '서버와의 통신 중 오류가 발생했습니다.';
        loginMsg.style.display = 'block';
      }
    } else {
      //이메일 또는 비밀번호가 입력을 안하면
      loginMsg.textContent = '이메일과 비밀번호를 모두 입력해주세요.';
      loginMsg.style.display = 'block';
    }
  });
});
