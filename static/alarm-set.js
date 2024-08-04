import { getCookie, getAccessTokenWithRefreshToken } from "./tokenUtils.js";

const API_SERVER_DOMAIN = "http://3.36.216.93:8000/";
const accessToken = getCookie("access_token");

document.addEventListener("DOMContentLoaded", () => {
  const alarmContainer = document.getElementById("alarm-container");

  // 알람 목록 로드 함수
  function loadAlarms() {
    if (!accessToken) {
      alert("로그인되지 않았습니다.");
      window.location.href = "./login.html";
      return;
    }

    fetch(API_SERVER_DOMAIN + "notifications/alarm/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("알람을 불러오는 데 실패했습니다.");
        }
        return response.json();
      })
      .then((alarms) => {
        alarmContainer.innerHTML = "";
        localStorage.setItem("alarms", JSON.stringify(alarms)); // 알람 데이터 localStorage에 저장
        alarms.forEach((alarm, index) => {
          const alarmElement = createAlarmElement(alarm, index);
          alarmContainer.appendChild(alarmElement);
        });
      })
      .catch((error) => {
        console.error("알람 로드 실패:", error);
        alert("알람을 로드하는 데 오류가 발생했습니다.");
      });
  }

  // 알람 요소 생성하는 함수
  function createAlarmElement(alarm, index) {
    const alarmGroup = document.createElement("div");
    alarmGroup.className = "alarm-group";
    alarmGroup.innerHTML = `
        <div class="alarm-group-left">
          <div class="alarm-name">${alarm.title}</div>
          <div class="alarm-clock">${alarm.time}</div>
        </div>
        <div class="alarm-group-right">
          <div class="alarm-edit" data-index="${index}">편집</div>
          <div class="alarm-delete" data-index="${index}">삭제</div>
        </div>
      `;

    const editButton = alarmGroup.querySelector(".alarm-edit");
    editButton.addEventListener("click", () => editAlarm(alarm.id));

    const deleteButton = alarmGroup.querySelector(".alarm-delete");
    deleteButton.addEventListener("click", () => deleteAlarm(alarm.id));

    return alarmGroup;
  }

  // 알람 편집하는 함수
  function editAlarm(alarmId) {
    window.location.href = `./alarm-add-edit.html?edit=true&id=${alarmId}`;
  }

  // 알람 삭제하는 함수
  function deleteAlarm(alarmId) {
    if (confirm("정말로 이 알람을 삭제하시겠습니까?")) {
      fetch(API_SERVER_DOMAIN + `notifications/alarm/${alarmId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("알람 삭제에 실패했습니다.");
          }
          loadAlarms(); // 알람 목록 새로고침
        })
        .catch((error) => {
          console.error("알람 삭제 실패:", error);
          alert("알람을 삭제하는 데 오류가 발생했습니다.");
        });
    }
  }

  // 알람 체크 함수
  function checkAlarms() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const alarms = JSON.parse(localStorage.getItem("alarms") || "[]");

    alarms.forEach((alarm) => {
      const { hours, minutes } = parseTime(alarm.time);

      if (
        hours === currentHour &&
        minutes === currentMinute &&
        !alarm.dismissed
      ) {
        alert(`알람: ${alarm.title} - ${alarm.time} 시간됐어요!`);
        // 알람을 울린 후 dismissed 상태로 표시
        alarm.dismissed = true;
        localStorage.setItem("alarms", JSON.stringify(alarms));
      }
    });
  }

  // 현재 시간을 기준으로 알람을 체크하는 주기 설정 (1초마다)
  setInterval(checkAlarms, 1000);

  loadAlarms();

  // 시간 문자열 파싱 함수
  function parseTime(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    return { hours, minutes };
  }
});
