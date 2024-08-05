document.addEventListener("DOMContentLoaded", async function () {
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

  // 쿠키에서 accessToken을 가져오는 함수
  function getCookie(name) {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  // accessToken 가져오기
  const accessToken = getCookie("access_token");

  const API_SERVER_DOMAIN = "https://sickretcare.store/";

  try {
    const response = await fetch(API_SERVER_DOMAIN + "users/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 200) {
      const result = await response.json();
      console.log(result);
      nicknameInput.value = result.nickname;
    } else if (response.status === 401) {
      alert("로그인이 필요합니다.");
      window.location.href = "./main.html";
    } else {
      alert("회원 정보를 불러오는 데 실패했습니다.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("서버와의 통신 중 오류가 발생했습니다.");
  }

  // 별명이 중복될 때 메시지를 표시하는 함수
  function checkNickname() {
    const existingNicknames = ["existingNickname1", "existingNickname2"]; // 이미 존재하는 별명 리스트
    if (existingNicknames.includes(nicknameInput.value)) {
      nicknameMsg.style.display = "block";
    } else {
      nicknameMsg.style.display = "none";
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
    checkFormValidity();
  });

  newPasswordInput.addEventListener("input", checkFormValidity);

  // 버튼 클릭 이벤트 리스너 추가
  profileEditBtn.addEventListener("click", async function () {
    if (!profileEditBtn.disabled) {
      // 사용자 입력값 가져오기
      const nickname = nicknameInput.value.trim();
      const oldPassword = oldPasswordInput.value.trim();
      const newPassword = newPasswordInput.value.trim();

      // 비밀번호와 별명 중 하나라도 빈 값인 경우 처리
      if (!oldPassword || !newPassword || !nickname) {
        alert("모든 필드를 올바르게 입력해 주세요.");
        return;
      }

      try {
        const response = await fetch(API_SERVER_DOMAIN + "users/", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nickname: nickname,
            password: oldPassword,
            new_password: newPassword,
          }),
        });

        if (response.status === 200) {
          const result = await response.json();
          console.log(result);
          alert("회원 정보가 성공적으로 수정되었습니다.");
          window.location.href = "./mypage.html";
        } else if (response.status === 400) {
          alert("기존 비밀번호가 틀리거나 비밀번호 입력이 올바르지 않습니다.");
        } else if (response.status === 401) {
          alert("로그인이 필요합니다.");
          window.location.href = "./main.html";
        } else {
          alert("회원 정보를 수정하는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("서버와의 통신 중 오류가 발생했습니다.");
      }
    }
  });

  profileEditBtn.disabled = true;
});
