document.addEventListener('DOMContentLoaded', () => {
    const timerText = document.getElementById('timerText');
    const timerOverlay = document.getElementById('timerOverlay');

    function startTimer(endTime) {
        function updateTimer() {
            const now = Date.now();
            const remainingTime = Math.max(0, Math.round((endTime - now) / 1000)); // 초 단위

            const min = Math.floor(remainingTime / 60);
            const sec = remainingTime % 60;
            timerText.textContent = `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;

            const rotation = 360 * (1 - remainingTime / (endTime - Date.now()));
            timerOverlay.style.transform = `rotate(${rotation}deg)`;

            if (remainingTime > 0) {
                setTimeout(updateTimer, 1000);
            } else {
                alert('타이머가 종료되었습니다.');
                localStorage.removeItem('timerEndTime');
                localStorage.removeItem('timerDuration');
                window.location.href = './main.html'; // 타이머가 종료되면 메인 페이지로 이동
            }
        }

        updateTimer();
    }

    const timerEndTime = parseInt(localStorage.getItem('timerEndTime'), 10);
    if (isNaN(timerEndTime) || timerEndTime <= Date.now()) {
        alert('타이머 설정이 잘못되었습니다.');
        localStorage.removeItem('timerEndTime');
        localStorage.removeItem('timerDuration');
        window.location.href = './main.html'; // 잘못된 설정 시 메인 페이지로 이동
    } else {
        startTimer(timerEndTime);
    }
});