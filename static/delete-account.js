import { getCookie, getAccessTokenWithRefreshToken } from "./tokenUtils.js";

const API_SERVER_DOMAIN = "http://3.36.216.93:8000/";

const accessToken = getCookie("access_token");

// 쿠키를 삭제하는 함수
function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

document.addEventListener("DOMContentLoaded", function () {
  const passwordInputs = document.querySelectorAll(
    '.form-input[type="password"]'
  );
  const passwordInput = passwordInputs[0];
  const passwordConfirmInput = passwordInputs[1];
  const pwMsg = document.getElementById("pw-msg-2");
  const deleteAccountBtn = document.querySelector(".delete-account-btn");

  pwMsg.style.display = "none";

  // 비밀번호 확인 함수
  function validatePasswords() {
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    const isValid = password && passwordConfirm && password === passwordConfirm;
    pwMsg.style.display = isValid ? "none" : "inline";
    deleteAccountBtn.disabled = !isValid;
    deleteAccountBtn.style.backgroundColor = isValid ? "#3B89FF" : "#9E9E9E";
  }

  // 입력 필드에 대한 이벤트 리스너
  passwordInput.addEventListener("input", validatePasswords);
  passwordConfirmInput.addEventListener("input", validatePasswords);

  // 회원 탈퇴 버튼 클릭 이벤트 리스너
  deleteAccountBtn.addEventListener("click", async function (event) {
    event.preventDefault(); // 기본 동작 방지

    if (deleteAccountBtn.disabled) {
      return;
    }

    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    if (password && password === passwordConfirm) {
      try {
        const response = await fetch(API_SERVER_DOMAIN + "users/", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password1: password,
            password2: passwordConfirm,
          }),
        });

        if (response.ok) {
          deleteCookie("access_token");
          deleteCookie("refresh_token");
          window.location.href = "./login.html";
        } else if (response.status === 400) {
          alert("비밀번호가 틀렸거나 비밀번호 입력이 올바르지 않습니다.");
        } else if (response.status === 401) {
          alert("로그인이 필요합니다.");
          window.location.href = "./login.html";
        } else {
          alert("회원 탈퇴에 실패했습니다.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      alert("비밀번호가 일치하지 않거나 비밀번호를 입력하지 않았습니다.");
    }
  });

  validatePasswords();
});
