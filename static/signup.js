document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const passwordConfirmInput = document.getElementById("password-confirm");
  const nameInput = document.getElementById("name");
  const nicknameInput = document.getElementById("nickname");
  const signupBtn = document.getElementById("signup-btn");

  const emailMsg = document.getElementById("email-msg");
  const pwMsg = document.getElementById("pw-msg");
  const nicknameMsg = document.getElementById("nickname-msg");

  const existingEmails = ["test@example.com"];
  const existingNicknames = ["user123"];

  // 모든 오류 메시지를 초기에 숨김
  [emailMsg, pwMsg, nicknameMsg].forEach((msg) => {
    if (msg) msg.style.display = "none";
  });

  function validateForm() {
    let isValid = true;

    // 이메일 유효성 검사
    if (existingEmails.includes(emailInput.value)) {
      emailMsg.style.display = "inline";
      isValid = false;
    } else {
      emailMsg.style.display = "none";
    }

    // 비밀번호 확인 유효성 검사
    if (passwordInput.value !== passwordConfirmInput.value) {
      pwMsg.style.display = "inline";
      isValid = false;
    } else {
      pwMsg.style.display = "none";
    }

    // 별명 유효성 검사
    if (existingNicknames.includes(nicknameInput.value)) {
      nicknameMsg.style.display = "inline";
      isValid = false;
    } else {
      nicknameMsg.style.display = "none";
    }

    // 모든 입력 필드가 채워졌는지 확인
    const allFieldsFilled = [
      emailInput,
      passwordInput,
      passwordConfirmInput,
      nameInput,
      nicknameInput,
    ].every((input) => input.value.trim() !== "");

    // 버튼 활성화 및 색상 변경
    if (allFieldsFilled && isValid) {
      signupBtn.disabled = false;
      signupBtn.style.backgroundColor = "#3B89FF";
    } else {
      signupBtn.disabled = true;
      signupBtn.style.backgroundColor = "#9E9E9E";
    }
  }

  // 각 입력 필드에 이벤트 리스너 추가
  [
    emailInput,
    passwordInput,
    passwordConfirmInput,
    nameInput,
    nicknameInput,
  ].forEach((input) => {
    input.addEventListener("input", validateForm);
  });

  signupBtn.addEventListener("click", function (event) {
    if (!signupBtn.disabled) {
      window.location.href = "./login.html";
    } else {
      event.preventDefault();
    }
  });

  // 초기 상태 설정
  validateForm();
});
