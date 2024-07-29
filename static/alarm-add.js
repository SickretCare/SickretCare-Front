document.addEventListener("DOMContentLoaded", () => {
  const hourSelect = document.getElementById("hour-select");
  const minuteSelect = document.getElementById("minute-select");
  const ampmSelect = document.getElementById("ampm-select");

  // 시간 옵션 생성
  for (let i = 1; i <= 12; i++) {
    const div = document.createElement("div");
    div.className = "scroll-option";
    div.textContent = i;
    hourSelect.appendChild(div);
  }

  // 분 옵션 생성
  for (let i = 0; i < 60; i += 1) {
    const div = document.createElement("div");
    div.className = "scroll-option";
    div.textContent = i < 10 ? "0" + i : i;
    minuteSelect.appendChild(div);
  }

  // AM/PM 옵션 생성
  const ampmOptions = ["오전", "오후"];
  ampmOptions.forEach((optionText) => {
    const div = document.createElement("div");
    div.className = "scroll-option";
    div.textContent = optionText;
    ampmSelect.appendChild(div);
  });

  // 선택된 옵션 색상 변경
  function updateSelectedOption(selectElement) {
    const options = selectElement.children;
    const scrollTop = selectElement.scrollTop;
    const selectedIndex = Math.round((scrollTop + 92) / 40); // 92는 선택 박스의 가운데로 옵션을 맞추기 위한 오프셋

    for (let i = 0; i < options.length; i++) {
      options[i].classList.remove("selected");
      if (i === selectedIndex) {
        options[i].classList.add("selected");
      }
    }
  }

  // 스크롤 이벤트 리스너 추가
  hourSelect.addEventListener("scroll", () => updateSelectedOption(hourSelect));
  minuteSelect.addEventListener("scroll", () =>
    updateSelectedOption(minuteSelect)
  );
  ampmSelect.addEventListener("scroll", () => updateSelectedOption(ampmSelect));

  // 초기 선택된 옵션 색상 설정
  updateSelectedOption(hourSelect);
  updateSelectedOption(minuteSelect);
  updateSelectedOption(ampmSelect);
});
