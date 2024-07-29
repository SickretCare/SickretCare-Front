// script.js
document.addEventListener("DOMContentLoaded", () => {
    const minuteBox = document.getElementById("minute-box");
    const highlightBox = document.querySelector(".highlight-box");
    const setMinuteBtn = document.getElementById("set-minute-btn");
    const selectedMinuteDisplay = document.getElementById("selected-minute");

    // 분 옵션을 동적으로 생성
    for (let i = 1; i < 16; i++) {
        const option = document.createElement("div");
        option.className = "option";
        option.textContent = i < 10 ? '0' + i : i;
        minuteBox.appendChild(option);
    }

    function updateHighlightBox() {
        const options = minuteBox.querySelectorAll(".option");
        const scrollTop = minuteBox.scrollTop;
        const optionHeight = options[0].offsetHeight;
        const visibleHeight = minuteBox.offsetHeight;
        const centerIndex = Math.floor((scrollTop + visibleHeight / 2) / optionHeight);
    }

    minuteBox.addEventListener("scroll", updateHighlightBox);

    setMinuteBtn.addEventListener("click", () => {
        const highlightedOption = [...minuteBox.querySelectorAll(".option")].find(option => option.style.color === "white");
        if (highlightedOption) {
            const selectedMinute = highlightedOption.textContent;
            selectedMinuteDisplay.textContent = `선택한 분: ${selectedMinute}분`;
        }
    });

    // 초기 스크롤 시 중앙 옵션 강조
    updateHighlightBox();
});
