import { getCookie, getAccessTokenWithRefreshToken } from './tokenUtils.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Access Token을 쿠키에서 가져오고, 필요 시 Refresh Token으로 갱신
    let accessToken = getCookie('access_token');
    const refreshToken = getCookie('refresh_token');

    try {
        if (refreshToken) {
            // Refresh Token을 사용하여 Access Token 갱신
            accessToken = await getAccessTokenWithRefreshToken(refreshToken);
            // 갱신된 토큰을 쿠키에 저장
            document.cookie = `access_token=${accessToken}; path=/`;
        }

        // 슬라이드 기능
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

        // 타이머 버튼 기능
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

        // 알림, 쇼핑, 좋아요 버튼 기능
        const alarmBtn = document.querySelector('.quick_alarm_button');
        const shopBtn = document.querySelector('.quick_shop_button');
        const likeBtn = document.querySelector('.quick_like_button');

        alarmBtn.addEventListener('click', () => {
            window.location.href = './alarm-set.html';
        });
        shopBtn.addEventListener('click', () => {
            window.location.href = './shop.html';
        });
        likeBtn.addEventListener('click', () => {
            window.location.href = './liked-posts.html';
        });

        // 커뮤니티 인기 게시물 불러오기
        const popularContainer = document.querySelector('.community_popular');
        const API_SERVER_DOMAIN = 'http://3.36.216.93:8000/posts/list/';
        const category = '전체';
        const orderBy = '좋아요순'; 

        const response = await fetch(`${API_SERVER_DOMAIN}?category=${encodeURIComponent(category)}&order_by=${encodeURIComponent(orderBy)}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}` // Access Token을 헤더에 포함
            }
        });

        if (!response.ok) {
            throw new Error('유유유 불러오지 못했어요 ㅠㅠㅠ');
        }

        const data = await response.json();

        // 기존 게시물 제거
        popularContainer.innerHTML = '';

        // 게시물의 처음 3개만 표시되도록 해주자
        const postsToShow = data.slice(0, 3);

        postsToShow.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.className = 'community_popular_content_tab';
            postDiv.setAttribute('data-post-id', post.id);
            postDiv.innerHTML = `
                <span id="community_pop_title">${truncateText(post.title, 20)}</span><br>
                <div class="community_pop_subcontainer">
                    <span id="community_pop_subtitle">${truncateText(post.content, 50)}</span>
                </div>
                <div class="like-container">
                    <i class="fa-solid fa-heart like-icon"></i>
                    <span class="like-count">${post.likes_num}</span>
                </div>
            `;
            popularContainer.appendChild(postDiv);
        });

        // 게시글 클릭 이벤트 핸들러 추가
        document.querySelectorAll('.community_popular_content_tab').forEach(element => {
            element.addEventListener('click', () => {
                const postId = element.getAttribute('data-post-id');
                window.location.href = `./community_detail.html?id=${postId}`;
            });
        });
    } catch (error) {
        console.error('Error:', error);
        window.location.href = './login.html'; // 로그인 페이지로 리디렉션
    }
});

// 텍스트를 일정 길이로 자르고 '...'을 추가하는 함수
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
}
