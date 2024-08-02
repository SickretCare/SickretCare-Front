document.addEventListener('DOMContentLoaded', () => {
    let currentIndex = 0;
    const slides = document.querySelector('.slides');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = document.querySelectorAll('.slide').length;

    const updateDots = () => {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    };

    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        const offset = -currentIndex * 100;
        slides.style.transform = `translateX(${offset}%)`;
        updateDots();
    }, 3000); // 슬라이드 변경 간격을 3초로 설정
});

document.addEventListener('DOMContentLoaded', () => {
    const startTimerBtn = document.querySelector('.timer-button');

    startTimerBtn.addEventListener('click', () => {
        const timerDuration = localStorage.getItem('timerDuration');

        if (timerDuration) {
            const endTime = Date.now() + parseInt(timerDuration, 10) * 60000; // 현재 시간 + 설정된 시간(밀리초)
            localStorage.setItem('timerEndTime', endTime);
            window.location.href = './view_timer.html'; // 타이머 페이지로 이동
        } else {
            alert('타이머가 설정되지 않았습니다. 타이머 설정 페이지로 이동합니다.');
            window.location.href = './set_timer.html'; // 타이머 설정 페이지로 이동
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const alarmBtn = document.querySelector('.quick_alarm_button');
    const shopBtn = document.querySelector('.quick_shop_button');
    const likeBtn = document.querySelector('.quick_like_button');

    alarmBtn.addEventListener('click', () => {
        window.location.href = './alarm-set.html'
    });
    shopBtn.addEventListener('click', () => {
        window.location.href = './shop.html';
    })
    likeBtn.addEventListener('click', () => {
        window.location.href = './liked-posts.html';
    })
});