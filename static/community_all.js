document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = 'http://3.36.216.93:8000/posts/list/';
    let category = '전체';  // 기본 카테고리
    let orderBy = '최신순'; // 기본 정렬 기준

    const hashtagButtons = document.querySelectorAll('.hashtag_container button');
    const sortLinks = document.querySelectorAll('.sort_buttons .sort-link');
    const writeButton = document.querySelector('.write_btn');

    function selectHashtagButton(button) {
        hashtagButtons.forEach(btn => btn.classList.remove('selected-button', 'active'));
        button.classList.add('selected-button', 'active');
    }

    function selectSortLink(link) {
        sortLinks.forEach(lnk => lnk.classList.remove('active'));
        link.classList.add('active');
    }

    //날짜를 이쁘게 파싱해주는 함수!!
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 추가
        const day = date.getDate();

        return `${year}/${month}/${day}`;
    }

    function fetchPosts() {
        const url = `${apiUrl}?category=${encodeURIComponent(category)}&order_by=${encodeURIComponent(orderBy)}`;
        console.log("Fetching posts from URL:", url);

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Posts data:", data);
                displayPosts(data);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }

    function displayPosts(data) {
        const contentContainer = document.querySelector('.scrollable-content');
        contentContainer.innerHTML = '';

        data.forEach(post => {
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

    function initializeDefaults() {
        // 기본적으로 '전체' 버튼과 '최신순' 링크 선택
        const defaultHashtagButton = document.getElementById('hashtag_all');
        const defaultSortLink = document.querySelector('.sort_buttons .sort-link.active');
        selectHashtagButton(defaultHashtagButton);
        selectSortLink(defaultSortLink);
        fetchPosts(); // 페이지 로드 시 기본 게시글 로드
    }

    // 초기화
    initializeDefaults();

    // 해시태그 버튼 클릭 이벤트 핸들러
    hashtagButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            selectHashtagButton(btn);
            category = btn.textContent === '모두 보기' ? '전체' : btn.textContent.replace('#', ''); // 카테고리 업데이트
            fetchPosts(); // 게시글 재로드
        });
    });

    // 정렬 링크 클릭 이벤트 핸들러
    sortLinks.forEach(lnk => {
        lnk.addEventListener('click', (event) => {
            event.preventDefault(); // 기본 링크 동작 방지
            selectSortLink(lnk);
            orderBy = lnk.textContent === '좋아요순' ? '좋아요순' : '최신순'; // 정렬 기준 업데이트
            fetchPosts(); // 게시글 재로드
        });
    });

    // 작성 버튼 클릭 이벤트 핸들러
    writeButton.addEventListener('click', () => {
        window.location.href = './write_community.html'; // 이동할 페이지 URL로 변경
    });
});

//텍스트를 일정 길이로 자르고 '...'을 추가하는 함수
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
}