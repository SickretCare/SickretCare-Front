document.addEventListener("DOMContentLoaded", () => {
  const alarmContainer = document.getElementById("alarm-container");

  // 알람 로드하는 함수
  function loadAlarms() {
    const alarms = JSON.parse(localStorage.getItem("alarms") || "[]");
    alarmContainer.innerHTML = "";

    alarms.forEach((alarm, index) => {
      const alarmElement = createAlarmElement(alarm, index);
      alarmContainer.appendChild(alarmElement);
    });
  }

  // 알람 요소 생성하는 함수
  function createAlarmElement(alarm, index) {
    const alarmGroup = document.createElement("div");
    alarmGroup.className = "alarm-group";
    alarmGroup.innerHTML = `
        <div class="alarm-group-left">
          <div class="alarm-name">${alarm.name}</div>
          <div class="alarm-clock">${alarm.time}</div>
        </div>
        <div class="alarm-group-right">
          <div class="alarm-edit" data-index="${index}">편집</div>
          <div class="alarm-delete" data-index="${index}">삭제</div>
        </div>
      `;

    const editButton = alarmGroup.querySelector(".alarm-edit");
    editButton.addEventListener("click", () => editAlarm(index));

    const deleteButton = alarmGroup.querySelector(".alarm-delete");
    deleteButton.addEventListener("click", () => deleteAlarm(index));

    return alarmGroup;
  }

  // 알람 편집하는 함수
  function editAlarm(index) {
    const alarms = JSON.parse(localStorage.getItem("alarms") || "[]");
    const alarm = alarms[index];
    const encodedAlarm = encodeURIComponent(JSON.stringify(alarm));
    window.location.href = `./alarm-add-edit.html?edit=true&alarm=${encodedAlarm}&index=${index}`;
  }

  // 알람 삭제하는 함수
  function deleteAlarm(index) {
    const alarms = JSON.parse(localStorage.getItem("alarms") || "[]");
    alarms.splice(index, 1);
    localStorage.setItem("alarms", JSON.stringify(alarms));
    loadAlarms();
  }

  // 알람 체크 함수
  function checkAlarms() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const alarms = JSON.parse(localStorage.getItem("alarms") || "[]");

    alarms.forEach(alarm => {
      const { hours, minutes } = parseTime(alarm.time);
      if (hours === currentHour && minutes === currentMinute) {
        alert(`알람: ${alarm.name} - ${alarm.time} 시간됐어요!`);
        // 알람을 울린 후 제거 (원하는 동작에 따라 변경 가능)
        const index = alarms.indexOf(alarm);
        if (index > -1) {
          alarms.splice(index, 1);
          localStorage.setItem("alarms", JSON.stringify(alarms));
          loadAlarms();
        }
      }
    });
  }

  // 현재 시간을 기준으로 알람을 체크하는 주기 설정 (1초마다)
  setInterval(checkAlarms, 1000);

  loadAlarms();

  // 시간 문자열 파싱 함수
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
});
