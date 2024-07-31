document.addEventListener("DOMContentLoaded", () => {
  const hourSelect = document.querySelector("#hourScroll");
  const minuteSelect = document.querySelector("#minuteScroll");
  const alarmNameInput = document.querySelector(".alarm-title-input");
  const addAlarmBtn = document.querySelector(".alarm-add-edit-btn");
  const selectionBox = document.querySelector("#selectionBox");

  let isEditMode = false;
  let editIndex = -1;

  function createOptions(container, start, end, padding = true) {
    container.innerHTML = "";

    // 상단 패딩
    if (padding) {
      for (let i = 0; i < 2; i++) {
        const padDiv = document.createElement("div");
        padDiv.className = "scroll-option pad";
        container.appendChild(padDiv);
      }
    }

    for (let i = start; i <= end; i++) {
      const div = document.createElement("div");
      div.className = "scroll-option";
      div.textContent = i < 10 ? "0" + i : i;
      container.appendChild(div);
    }

    // 하단 패딩
    if (padding) {
      for (let i = 0; i < 2; i++) {
        const padDiv = document.createElement("div");
        padDiv.className = "scroll-option pad";
        container.appendChild(padDiv);
      }
    }
  }

  function updateSelectedOption(selectElement) {
    // 패딩 아닌 옵션 모두 선택하기
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
    updateSelectionBox();
  }

  function updateSelectionBox() {
    const selectedHour = updateSelectedOption(hourSelect);
    const selectedMinute = updateSelectedOption(minuteSelect);
    // if (selectedHour !== null && selectedMinute !== null) {
    //   selectionBox.textContent = `${selectedHour}:${selectedMinute}`;
    // }
  }

  // 기본 시간 세팅하는 함수 -> 12:00
  function setDefaultTime() {
    setScrollPosition(hourSelect, 12);
    setScrollPosition(minuteSelect, 0);
  }

  function parseTime(timeString) {
    const [period, time] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "오후" && hours !== 12) {
      hours += 12;
    } else if (period === "오전" && hours === 12) {
      hours = 0;
    }
    return { hours, minutes };
  }

  createOptions(hourSelect, 0, 23);
  createOptions(minuteSelect, 0, 59);

  // URL 파라미터 확인
  const urlParams = new URLSearchParams(window.location.search);
  const editParam = urlParams.get("edit");
  const alarmParam = urlParams.get("alarm");
  const indexParam = urlParams.get("index");

  if (editParam === "true" && alarmParam && indexParam) {
    isEditMode = true;
    editIndex = parseInt(indexParam);
    const alarm = JSON.parse(decodeURIComponent(alarmParam));
    alarmNameInput.value = alarm.name;
    const { hours, minutes } = parseTime(alarm.time);
    setScrollPosition(hourSelect, hours);
    setScrollPosition(minuteSelect, minutes);
    addAlarmBtn.textContent = "저장";
  } else {
    setDefaultTime();
  }

  [hourSelect, minuteSelect].forEach((select) => {
    select.addEventListener("scroll", () => {
      requestAnimationFrame(() => {
        updateSelectedOption(select);
        updateSelectionBox();
      });
    });
  });

  // 알람 추가 버튼 클릭했을 때
  addAlarmBtn.addEventListener("click", () => {
    const alarmName = alarmNameInput.value;
    const hour = updateSelectedOption(hourSelect);
    const minute = updateSelectedOption(minuteSelect);

    if (alarmName.trim() === "") {
      alert("알람 이름을 입력해주세요.");
      return;
    }

    const alarmTime = `${hour}:${minute}`;
    const formattedTime = formatTime(alarmTime);

    const newAlarm = {
      name: alarmName,
      time: formattedTime,
    };

    const alarms = JSON.parse(localStorage.getItem("alarms") || "[]");

    if (isEditMode) {
      alarms[editIndex] = newAlarm;
    } else {
      alarms.push(newAlarm);
    }

    localStorage.setItem("alarms", JSON.stringify(alarms));
    window.location.href = "./alarm-set.html";
  });

  function formatTime(time) {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour < 12 ? "오전" : "오후";
    const formattedHour = hour % 12 || 12;
    return `${period} ${formattedHour}:${minute.toString().padStart(2, "0")}`;
  }

  // 초기 selection-box 업데이트
  updateSelectionBox();
});
