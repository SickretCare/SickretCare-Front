import { getCookie, getAccessTokenWithRefreshToken } from "./tokenUtils.js";

const API_SERVER_DOMAIN = "http://3.36.216.93:8000/";
const accessToken = getCookie("access_token");

document.addEventListener("DOMContentLoaded", () => {
  const timerText = document.getElementById("timerText");
  const timerOverlay = document.getElementById("timerOverlay");

  // 타이머 정보를 서버에서 가져오는 함수
  async function fetchTimerInfo() {
    try {
      const response = await fetch(API_SERVER_DOMAIN + "notifications/timer/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        // 인증 오류일 경우 새로운 토큰을 요청
        if (response.status === 401) {
          accessToken = await getAccessTokenWithRefreshToken();
          return fetchTimerInfo(); // 토큰 갱신 후 재시도
        }
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch timer info:", error);
      alert("타이머 정보를 가져오는 데 실패했습니다.");
      window.location.href = "./main.html";
    }
  }

  // 타이머 정보를 설정하는 함수
  async function initializeTimer() {
    const timerInfo = await fetchTimerInfo();
    if (timerInfo) {
      const endTime = parseInt(localStorage.getItem("timerEndTime"), 10);
      const totalTime =
        parseInt(localStorage.getItem("timerDuration"), 10) * 60; // 분을 초로 변환

      if (isNaN(endTime) || isNaN(totalTime) || endTime <= Date.now()) {
        alert("타이머 설정이 잘못되었습니다.");
        window.location.href = "./main.html";
        return;
      }

      function updateTimer() {
        const now = Date.now();
        const timeLeft = Math.max(0, Math.round((endTime - now) / 1000));

        const min = Math.floor(timeLeft / 60);
        const sec = timeLeft % 60;
        timerText.textContent = `${min.toString().padStart(2, "0")}:${sec
          .toString()
          .padStart(2, "0")}`;

        const progress = (totalTime - timeLeft) / totalTime;
        const degrees = progress * 360;
        timerOverlay.style.background = `conic-gradient(#3b82f6 0deg, #3b82f6 ${degrees}deg, transparent ${degrees}deg)`;

        if (timeLeft > 0) {
          requestAnimationFrame(updateTimer);
        } else {
          alert("타이머가 종료되었습니다.");
          window.location.href = "./main.html";
        }
      }

      updateTimer();
    }
  }

  initializeTimer();
});
