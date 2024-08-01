document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.querySelector(".login-btn");
  const emailInput = document.querySelector('input[type="email"]');
  const passwordInput = document.querySelector('input[type="password"]');
  const loginMsg = document.getElementById("login-msg");

  loginMsg.style.display = "none";

  // 모의 사용자 데이터
  const mockUserData = {
    "user@example.com": "password123",
  };

  loginBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (email !== "" && password !== "") {
      if (mockUserData[email] === password) {
        window.location.href = "./main.html";
      } else {
        loginMsg.textContent = "*이메일이나 비밀번호가 틀렸어요.";
        loginMsg.style.display = "block";
      }
    } else {
      // 이메일 또는 비밀번호가 입력되지 않은 경우
      loginMsg.textContent = "이메일과 비밀번호를 모두 입력해주세요.";
      loginMsg.style.display = "block";
    }
  });
});
