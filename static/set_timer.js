import { getCookie, getAccessTokenWithRefreshToken } from "./tokenUtils.js";

const API_SERVER_DOMAIN = "https://sickretcare.store/";
const accessToken = getCookie("access_token");

document.addEventListener("DOMContentLoaded", () => {
  const timerSelect = document.querySelector("#timer-minuteScroll");
  const settimerBtn = document.querySelector(".timer-add-edit-btn");

  // 타이머를 업데이트하는 함수
  async function updateTimer(interval) {
    try {
      const response = await fetch(API_SERVER_DOMAIN + "notifications/timer/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interval: interval }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to update timer:", error);
    }
  }

  // 타이머를 실행하는 함수
  async function startTimer(interval) {
    try {
      const response = await fetch(
        API_SERVER_DOMAIN + "notifications/timer/start/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ interval: interval }),
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to start timer:", error);
    }
  }

  // 스크롤 옵션을 생성하는 함수
  function createOptions(container, start, end, padding = true) {
    container.innerHTML = ""; // 기존 내용 제거

    const padDiv = document.createElement("div");
    padDiv.className = "scroll-option pad";
    container.append(padDiv, padDiv.cloneNode());

    // 실제 옵션 추가
    for (let i = start; i <= end; i++) {
      const div = document.createElement("div");
      div.className = "scroll-option";
      div.textContent = i.toString().padStart(2, "0");
      container.appendChild(div);
    }

    container.append(padDiv.cloneNode(), padDiv.cloneNode());
  }

  // 현재 선택된 옵션을 업데이트하는 함수
  function updateSelectedOption(selectElement) {
    const options = selectElement.querySelectorAll(".scroll-option:not(.pad)");
    const scrollTop = selectElement.scrollTop;
    const optionHeight = 40;
    const containerHeight = selectElement.clientHeight;
    const middleOffset = containerHeight / 2 - optionHeight / 2;

    const selectedIndex =
      Math.round((scrollTop + middleOffset) / optionHeight) - 2;

    options.forEach((option, index) => {
      option.classList.toggle("selected", index === selectedIndex);
    });

    return options[selectedIndex] ? options[selectedIndex].textContent : null;
  }

  // 스크롤 위치 설정하는 함수
  function setScrollPosition(element, value) {
    const optionHeight = 40;
    element.scrollTop = value * optionHeight;
    updateSelectedOption(element);
  }

  // 기본 타이머 시간을 설정하는 함수
  function setdefaulttimerTime() {
    setScrollPosition(timerSelect, 5);
  }

  createOptions(timerSelect, 5, 15);
  setdefaulttimerTime();

  // 타이머 설정 버튼 클릭 이벤트 핸들러
  settimerBtn.addEventListener("click", async () => {
    const timerminute = updateSelectedOption(timerSelect);
    if (timerminute) {
      const timerTime = parseInt(timerminute, 10);
      const endTime = Date.now() + timerTime * 60000; // 현재 시간 + 설정된 시간(밀리초)

      // 타이머 종료 시간을 로컬 저장소에 저장
      localStorage.setItem("timerEndTime", endTime);
      localStorage.setItem("timerDuration", timerTime);

      await updateTimer(timerTime);
      const startResponse = await startTimer(timerTime);
      console.log(startResponse.detail);

      // 타이머 페이지로 이동
      window.location.href = "./main.html";
    } else {
      console.log("타이머를 설정해 주세요.");
    }
  });

  // 스크롤 이벤트 핸들러
  timerSelect.addEventListener("scroll", () => {
    updateSelectedOption(timerSelect);
  });
});
