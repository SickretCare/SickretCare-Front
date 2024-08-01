document.addEventListener("DOMContentLoaded", function () {
  const nicknameInput = document.querySelector(
    "input[placeholder='별명을 입력해주세요. ']"
  );
  const oldPasswordInput = document.querySelectorAll(
    "input[placeholder='비밀번호를 입력해주세요. ']"
  )[0];
  const newPasswordInput = document.querySelectorAll(
    "input[placeholder='비밀번호를 입력해주세요. ']"
  )[1];
  const nicknameMsg = document.getElementById("nickname-msg-2");
  const pwMsg = document.getElementById("pw-msg-3");
  const profileEditBtn = document.querySelector(".profile-edit-btn");

  nicknameMsg.style.display = "none";
  pwMsg.style.display = "none";

  // 별명이 중복될 때 메시지를 표시하는 함수
  function checkNickname() {
    const existingNicknames = ["existingNickname1", "existingNickname2"]; // 이미 존재하는 별명 리스트
    if (existingNicknames.includes(nicknameInput.value)) {
      nicknameMsg.style.display = "block";
    } else {
      nicknameMsg.style.display = "none";
    }
  }

  // 비밀번호가 틀렸을 때 메시지를 표시하는 함수
  function checkPassword() {
    const correctPassword = "correctPassword"; // 올바른 비밀번호 예시
    if (oldPasswordInput.value !== correctPassword) {
      pwMsg.style.display = "block";
    } else {
      pwMsg.style.display = "none";
    }
  }

  // 모든 입력 필드와 메시지 상태를 확인하는 함수
  function checkFormValidity() {
    const allInputsFilled =
      nicknameInput.value && oldPasswordInput.value && newPasswordInput.value;
    const noErrorMessages =
      nicknameMsg.style.display === "none" && pwMsg.style.display === "none";

    if (allInputsFilled && noErrorMessages) {
      profileEditBtn.style.backgroundColor = "#3B89FF";
      profileEditBtn.disabled = false;
    } else {
      profileEditBtn.style.backgroundColor = "#9e9e9e";
      profileEditBtn.disabled = true;
    }
  }

  // 입력 필드 변경 이벤트 리스너 추가
  nicknameInput.addEventListener("input", function () {
    checkNickname();
    checkFormValidity();
  });

  oldPasswordInput.addEventListener("input", function () {
    checkPassword();
    checkFormValidity();
  });

  newPasswordInput.addEventListener("input", checkFormValidity);

  // 버튼 클릭 이벤트 리스너 추가
  profileEditBtn.addEventListener("click", function () {
    if (!profileEditBtn.disabled) {
      window.location.href = "./mypage.html";
    }
  });

  profileEditBtn.disabled = true;
});
