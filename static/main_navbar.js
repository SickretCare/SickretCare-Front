document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.querySelector(".menu-icon");
  const dropdownBox = document.querySelector(".dropdown-menu");
  const logoutButton = document.querySelector(".logout_btn");

  const API_SERVER_DOMAIN = "http://3.36.216.93:8000/";

  // 쿠키에서 accessToken을 가져오는 함수
  function getCookie(name) {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  // 쿠키를 삭제하는 함수
  function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  // accessToken 가져오기
  const accessToken = getCookie("access_token");

  // 메뉴 아이콘 클릭 시 드롭다운 메뉴 토글
  menuIcon.addEventListener("click", () => {
    menuIcon.classList.toggle("open");
    dropdownBox.classList.toggle("open");
  });

  // 로그아웃
  logoutButton.addEventListener("click", async function () {
    if (!accessToken) {
      alert("로그인 상태가 아닙니다.");
      window.location.href = "/login.html";
      return;
    }

    try {
      const response = await fetch(API_SERVER_DOMAIN + "users/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        window.location.href = "/login.html";
      } else {
        if (response.status === 401) {
          alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
        } else {
          alert("로그아웃에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("서버와의 통신 중 오류가 발생했습니다.");
    }
  });
});
