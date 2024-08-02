document.addEventListener("DOMContentLoaded", () => {
  const timerText = document.getElementById("timerText");
  const timerOverlay = document.getElementById("timerOverlay");

  const endTime = parseInt(localStorage.getItem("timerEndTime"), 10);
  const totalTime = parseInt(localStorage.getItem("timerDuration"), 10) * 60; // 분을 초로 변환

  if (isNaN(endTime) || isNaN(totalTime) || endTime <= Date.now()) {
    alert("타이머 설정이 잘못되었습니다.");
    window.location.href = "./main.html";
    return;
  }

  function updateTimer() {
    const now = Date.now();
    const timeLeft = Math.max(0, Math.round((endTime - now) / 1000));

    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    timerText.textContent = `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;

    const progress = (totalTime - timeLeft) / totalTime;
    const degrees = progress * 360;
    timerOverlay.style.background = `conic-gradient(#3b82f6 0deg, #3b82f6 ${degrees}deg, transparent ${degrees}deg)`;

    if (timeLeft > 0) {
      requestAnimationFrame(updateTimer);
    } else {
      alert("타이머가 종료되었습니다.");
      //   localStorage.removeItem("timerEndTime");
      //   localStorage.removeItem("timerDuration");
      window.location.href = "./main.html";
    }
  }

  updateTimer();
});
