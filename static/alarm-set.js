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

  loadAlarms();
});
