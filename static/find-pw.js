document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.querySelector('input[type="email"]');
  const findPwBtn = document.querySelector(".find-pw-btn");

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
});
