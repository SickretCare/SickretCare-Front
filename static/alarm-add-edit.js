import { getCookie, getAccessTokenWithRefreshToken } from "./tokenUtils.js";

const API_SERVER_DOMAIN = "http://3.36.216.93:8000/";
const accessToken = getCookie("access_token");

document.addEventListener("DOMContentLoaded", () => {
  const hourSelect = document.querySelector("#hourScroll");
  const minuteSelect = document.querySelector("#minuteScroll");
  const alarmNameInput = document.querySelector(".alarm-title-input");
  const addAlarmBtn = document.querySelector(".alarm-add-edit-btn");
  const selectionBox = document.querySelector("#selectionBox");

  const urlParams = new URLSearchParams(window.location.search);
  const isEditMode = urlParams.get("edit") === "true";
  const alarmId = urlParams.get("id");

  // 알람 단일 조회 함수
  function getAlarm(id) {
    if (!accessToken) {
      alert("로그인되지 않았습니다.");
      window.location.href = "./login.html";
      return;
    }

    return fetch(API_SERVER_DOMAIN + `notifications/alarm/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch alarm");
        }
        return response.json();
      })
      .then((data) => {
        console.log("알람 조회 성공:", data);
        alarmNameInput.value = data.title;
        const [hours, minutes] = data.time.split(":").map(Number);
        setScrollPosition(hourSelect, hours);
        setScrollPosition(minuteSelect, minutes);
      })
      .catch((error) => {
        console.error("알람 조회 실패:", error);
      });
  }

  // 알람 수정 함수
  function updateAlarm(id, title, time) {
    if (!accessToken) {
      alert("로그인되지 않았습니다.");
      window.location.href = "./login.html";
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("time", time);

    return fetch(API_SERVER_DOMAIN + `notifications/alarm/${id}/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update alarm");
        }
        return response.json();
      })
      .then((data) => {
        console.log("알람 수정 성공:", data);
        window.location.href = "./alarm-set.html";
      })
      .catch((error) => {
        console.error("알람 수정 실패:", error);
      });
  }

  // 새로운 알람 생성하는 함수
  function createAlarm(title, time) {
    if (!accessToken) {
      alert("로그인되지 않았습니다.");
      window.location.href = "./login.html";
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("time", time);

    return fetch(API_SERVER_DOMAIN + "notifications/alarm/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create alarm");
        }
        return response.json();
      })
      .then((data) => {
        console.log("알람 생성 성공:", data);
        window.location.href = "./alarm-set.html";
      })
      .catch((error) => {
        console.error("알람 생성 실패:", error);
      });
  }

  // 스크롤 옵션 생성하는 함수
  function createOptions(container, start, end, padding = true) {
    container.innerHTML = "";

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

  // 선택된 옵션 업데이트하는 함수
  function updateSelectedOption(selectElement) {
    // 패딩 아닌 옵션 모두 선택하기
    const options = selectElement.querySelectorAll(".scroll-option:not(.pad)");
    const optionHeight = 40;
    const containerHeight = selectElement.clientHeight;
    const middleOffset = containerHeight / 2 - optionHeight / 2;
    const scrollTop = selectElement.scrollTop;
    const selectedIndex =
      Math.round((scrollTop + middleOffset) / optionHeight) - 2;

    options.forEach((option, index) => {
      option.classList.toggle("selected", index === selectedIndex);
    });

    return options[selectedIndex]?.textContent || null;
  }

  // 스크롤 위치 설정하는 함수
  function setScrollPosition(element, value) {
    const optionHeight = 40;
    element.scrollTop = value * optionHeight;
    updateSelectedOption(element);
  }

  // 기본 시간 세팅
  function setDefaultTime() {
    setScrollPosition(hourSelect, 12);
    setScrollPosition(minuteSelect, 30);
  }

  // 시간 문자열 파싱 함수
  function parseTime(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    return { hours, minutes };
  }

  createOptions(hourSelect, 0, 23);
  createOptions(minuteSelect, 0, 59);

  // 편집 모드일 경우
  if (isEditMode) {
    getAlarm(alarmId);
    addAlarmBtn.textContent = "저장"; // 버튼 텍스트 변경
  } else {
    setDefaultTime();
  }

  // 스크롤 이벤트 리스너 추가
  [hourSelect, minuteSelect].forEach((select) => {
    select.addEventListener("scroll", () => {
      requestAnimationFrame(() => {
        updateSelectedOption(select);
      });
    });
  });

  // 알람 추가/저장 버튼 클릭 시
  addAlarmBtn.addEventListener("click", () => {
    const alarmName = alarmNameInput.value;
    const hour = updateSelectedOption(hourSelect);
    const minute = updateSelectedOption(minuteSelect);

    if (alarmName.trim() === "") {
      alert("알람 이름을 입력해주세요.");
      return;
    }

    const alarmTime = `${hour}${minute}`;

    if (isEditMode) {
      updateAlarm(alarmId, alarmName, alarmTime);
    } else {
      createAlarm(alarmName, alarmTime);
    }
  });
});
