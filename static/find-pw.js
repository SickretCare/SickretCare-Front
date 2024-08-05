document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.querySelector('input[type="email"]');
  const findPwBtn = document.querySelector(".find-pw-btn");

  const API_SERVER_DOMAIN = "https://sickretcare.store/";

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function updateButtonState() {
    if (validateEmail(emailInput.value)) {
      findPwBtn.style.backgroundColor = "#3B89FF";
      findPwBtn.disabled = false;
    } else {
      findPwBtn.style.backgroundColor = "#9e9e9e";
      findPwBtn.disabled = true;
    }
  }

  emailInput.addEventListener("input", updateButtonState);

  // 초기 상태 설정
  updateButtonState();

  findPwBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();

    if (validateEmail(email)) {
      try {
        const formData = new FormData();
        formData.append("email", email);

        const response = await fetch(API_SERVER_DOMAIN + "users/reset_pw/", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          alert(result.detail || "임시 비밀번호가 발송되었습니다.");
          window.location.href = "./login.html";
        } else if (response.status === 404) {
          alert("이메일로 가입된 계정이 없습니다.");
        } else {
          alert("서버 오류가 발생했습니다.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("서버와의 통신 중 오류가 발생했습니다.");
      }
    } else {
      alert("유효한 이메일 주소를 입력해주세요.");
    }
  });
});
