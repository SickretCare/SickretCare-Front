document.addEventListener("DOMContentLoaded", () => {
    const timerSelect = document.querySelector("#timer-minuteScroll");
    const settimerBtn = document.querySelector(".timer-add-edit-btn");

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

    function setdefaulttimerTime(){
        setScrollPosition(timerSelect, 5);
    }

    createOptions(timerSelect, 5, 15);
    setdefaulttimerTime();

    settimerBtn.addEventListener("click", () => {
        const timerminute = updateSelectedOption(timerSelect);
        if (timerminute) {
            const timerTime = parseInt(timerminute, 10);
            alert(`${timerTime}분 설정되셨습니다.`);
        } else {
            alert('타이머 설정 해주세요.');
        }
    });

    // Add scroll event listener to update selection
    timerSelect.addEventListener("scroll", () => {
        updateSelectedOption(timerSelect);
    });
});