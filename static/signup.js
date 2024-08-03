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

  // 모든 오류 메시지를 초기에 숨김
  [emailMsg, pwMsg, nicknameMsg].forEach((msg) => {
    if (msg) msg.style.display = "none";
  });

  function validateForm() {
    let isValid = true;


    // 비밀번호 확인 유효성 검사
    if (passwordInput.value !== passwordConfirmInput.value) {
      pwMsg.style.display = "inline";
      isValid = false;
    } else {
      pwMsg.style.display = "none";
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

  signupBtn.addEventListener("click", async function () {
    if (signupBtn.disabled) return;
  
    const email = emailInput.value;
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;
    const name = nameInput.value;
    const nickname = nicknameInput.value;
  
    const formData = {
      email: email,
      password1: password,
      password2: passwordConfirm,
      username: name,
      nickname: nickname
    };
    
    const API_SERVER_DOMAIN = 'http://3.36.216.93:8000/';
    try {
      const response = await fetch(API_SERVER_DOMAIN + "users/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
  
      if (response.status === 201) {
        // 회원가입 성공 후 처리
        window.location.href = "./login.html";
      } else {
        const result = await response.json();
        console.log(result);
  
        if (response.status === 400) {
          alert("비밀번호가 일치하지 않거나 공백값이 있습니다.");
        } else if (response.status === 409) {
          console.log(response.status);
          if (result.error.includes("이메일이 중복됩니다.")) {
            emailMsg.style.display = "inline";
          }
          if (result.error.includes("닉네임이 중복됩니다.")) {
            nicknameMsg.style.display = "inline";
          }
        } else {
          alert("알 수 없는 오류가 발생했습니다.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("서버와의 통신 중 오류가 발생했습니다.");
    }
  });
  
  // 초기 상태 설정
  validateForm();
  
});
