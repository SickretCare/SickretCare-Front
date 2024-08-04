const API_SERVER_DOMAIN = 'http://3.36.216.93:8000/';

document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = API_SERVER_DOMAIN + 'posts/mypost/';
    const hashtagButtons = document.querySelectorAll('.hashtag_container_2 button');
    const contentContainer = document.querySelector('.scrollable-content');
    let allPosts = []; // 모든 게시글을 저장할 배열

    // 쿠키에서 accessToken을 가져오는 함수
    function getCookie(name) {
        let value = `; ${document.cookie}`;
        let parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    }
    // accessToken 가져오기
    const accessToken = getCookie("access_token");

    function fetchMyPosts() {
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            allPosts = data; // 모든 게시글을 저장
            displayPosts(allPosts); // 저장된 게시글을 표시
        })
        .catch(error => {
            console.error('Error fetching my posts:', error);
        });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 추가
        const day = date.getDate();

        return `${year}/${month}/${day}`;
    }

    function displayPosts(posts) {
        contentContainer.innerHTML = '';

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('community_all_content_tab');
            postElement.innerHTML = `
                <div class="community_all_content" data-post-id="${post.id}">
                    <span id="content_title">${truncateText(post.title, 30)}</span>
                    <span id="content_subtitle">${truncateText(post.content, 30)}</span>
                    <div class="community_all_bottom">
                        <span id="content_date">${formatDate(post.created_at)}</span>
                        <div class="like-container">
                            <i class="fa-solid fa-heart like-icon"></i>
                            <span class="like-count">${post.likes_num}</span>
                        </div>
                    </div>
                </div>
            `;
            contentContainer.appendChild(postElement);
        });

        // 게시글 클릭 이벤트 핸들러 추가
        document.querySelectorAll('.community_all_content').forEach(element => {
            element.addEventListener('click', () => {
                const postId = element.getAttribute('data-post-id');
                window.location.href = `./community_detail.html?id=${postId}`;
            });
        });
    }

    function filterPostsByCategory(category) {
        if (category === '전체') {
            displayPosts(allPosts);
        } else {
            const filteredPosts = allPosts.filter(post => post.category.name === category);
            displayPosts(filteredPosts);
        }
    }

    function activateButton(button) {
        hashtagButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
    }

    // 해시태그 버튼 클릭 이벤트 핸들러
    hashtagButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedCategory = btn.textContent === '모두 보기' ? '전체' : btn.textContent.replace('#', '');
            filterPostsByCategory(selectedCategory);
            activateButton(btn);
        });
    });

    // "모두 보기" 버튼을 처음부터 활성화 상태로 설정
    const allButton = document.querySelector('#hashtag_all');
    allButton.classList.add('active');

    // 페이지 로드 시 기본 게시글 로드
    fetchMyPosts();
});

//텍스트를 일정 길이로 자르고 '...'을 추가하는 함수
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
}