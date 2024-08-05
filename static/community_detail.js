const API_SERVER_DOMAIN = 'http://3.36.216.93:8000/';

document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = API_SERVER_DOMAIN + 'posts/get/';
    const postId = getPostIdFromUrl();

    let usersData = null; // 전역 변수로 선언
    let postData = null; // 전역 변수로 선언

    if (postId) {
        fetchPostDetails(postId);
    } else {
        console.error('No post ID found in URL');
    }

    function getPostIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    // 쿠키에서 accessToken을 가져오는 함수
    function getCookie(name) {
        let value = `; ${document.cookie}`;
        let parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    // accessToken 가져오기
    const accessToken = getCookie("access_token");

    function fetchPostDetails(id) {
        const url = `${apiUrl}${id}/`;
        console.log("Fetching post details from URL:", url);

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Post details data:", data);
                postData = data; // 외부변수로 설정해줘야 아래에서 쓸 수 있음.
                if (data && data.post && data.post.author) {
                    displayPostDetails(data.post);
                    addComments(data.comments || []); // 댓글 데이터 처리 (빈 배열로 기본값 설정)
                    return fetch(API_SERVER_DOMAIN + 'users/', {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${accessToken}`, // 인증 토큰을 헤더에 포함
                        }
                    });
                } else {
                    throw new Error('Invalid post data');
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(users => {
                console.log("Users data:", users); // 불러온 사용자 데이터 출력
                // 사용자 데이터 처리
                usersData = users;
                const currentUser = postData.post.author.nickname === users.nickname;
                if (currentUser) {
                    const deleteButton = document.querySelector('.tab_delete_btn');
                    if (deleteButton) {
                        deleteButton.style.display = 'block'; // 삭제 버튼 표시
                        deleteButton.addEventListener('click', function() {
                            if (confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
                                deletePost(postId);
                            }
                        });
                    }
                }
                updateCommentDeleteButtons(); // 댓글 삭제 버튼 업데이트
            })
            .catch(error => {
                console.error('Error fetching post details or user info:', error);
            });
    }

    function displayPostDetails(post) {
        const profileImage = document.querySelector('.profile');
        const userNickname = document.getElementById('user_nickname');
        const communityDetailDate = document.getElementById('community_detail_date');
        const detailTitle = document.getElementById('detail_title');
        const detailContent = document.getElementById('detail_content');
        const detailHashtag = document.getElementById('detail_hashtag');
        const likeCount = document.getElementById('like-count');
        const deleteButton = document.querySelector('.tab_delete_btn');

        profileImage.src = './img/profile.png'; // 프로필 이미지
        userNickname.textContent = post.author.nickname;
        communityDetailDate.textContent = new Date(post.created_at).toLocaleDateString();
        detailTitle.textContent = post.title;
        detailContent.textContent = post.content;
        detailHashtag.textContent = `#${post.category.name}`;
        likeCount.textContent = post.likes_num;

        if (deleteButton) {
            deleteButton.style.display = 'none'; // 기본적으로 삭제 버튼 숨김
        }
        setupLikeButton(post.likes_num); // 좋아요 버튼 설정
    }

    function addComments(comments) {
        const commentContainer = document.querySelector('.comment_container');
        commentContainer.innerHTML = ''; // 기존 댓글 제거
    
        if (!Array.isArray(comments) || comments.length === 0) {
            const noCommentsMessage = document.createElement('div');
            commentContainer.appendChild(noCommentsMessage);
            return;
        }
    
        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment_tab';
            commentDiv.innerHTML = `
                <div class="comment_userinfo">
                    <img id="comment_profile" src="./img/profile.png" alt="Profile Picture">
                    <span id="comment_nickname">${comment.author.nickname}</span>
                </div>
                <div class="comment_content">
                    <span id="comment_content">${comment.content}</span>
                    <span id="comment_date">${new Date(comment.created_at).toLocaleTimeString()}</span>
                    <button class="comment_delete_btn" data-id="${comment.id}">삭제</button>
                </div>
            `;
            commentContainer.appendChild(commentDiv);
        });

        // 댓글 삭제 버튼 업데이트
        updateCommentDeleteButtons();
    }

    function updateCommentDeleteButtons() {
        document.querySelectorAll('.comment_delete_btn').forEach(button => {
            const commentId = button.getAttribute('data-id');
            const commentDiv = button.closest('.comment_tab');
            const commentAuthorNickname = commentDiv.querySelector('#comment_nickname').textContent;

            if (usersData && usersData.nickname === commentAuthorNickname) {
                button.style.display = 'block'; // 삭제 버튼 표시
                button.addEventListener('click', function() {
                    if (confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
                        deleteComment(commentId);
                    }
                });
            } else {
                button.style.display = 'none'; // 삭제 버튼 숨김
            }
        });
    }

    function deleteComment(commentId) {
        const url = `${API_SERVER_DOMAIN}posts/comment/delete/${commentId}/`; // 댓글 삭제 URL
    
        fetch(url, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log("댓글을 성공적으로 삭제하셨습니다!");
            // 댓글 삭제 후 페이지 갱신 또는 댓글 리스트 재조회
            fetchPostDetails(getPostIdFromUrl()); // 다시 댓글을 가져오기 위해
        })
        .catch(error => {
            console.error('삭제 실패:', error);
        });
    }

    function setupLikeButton(initialLikes, token) {
        const heartButton = document.getElementById('heart');
        const likeCount = document.getElementById('like-count');
        let likes = initialLikes;
    
        heartButton.classList.toggle('active', likes > 0);
        heartButton.classList.toggle('fas', likes > 0);
        heartButton.classList.toggle('far', likes <= 0);
    
        heartButton.addEventListener('click', function() {
            const isLiked = heartButton.classList.contains('active');
    
            fetch(`${API_SERVER_DOMAIN}posts/like/${postId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`, 
                },
                body: JSON.stringify({ like: !isLiked })
            })
            .then(response => {
                if (response.status === 401) {
                    alert('로그인되지 않은 경우입니다.');
                    return;
                }
                if (response.status === 404) {
                    alert('해당 아이디의 게시물이 존재하지 않습니다.');
                    return;
                }
                if (!response.ok) {
                    throw new Error('서버 응답 오류');
                }
                return response.text().then(text => text ? JSON.parse(text) : {}); // 응답이 빈 경우 빈 객체 반환
                // return response.json();
            })
            .then(data => {
                if (data) {
                    heartButton.classList.toggle('active');
                    heartButton.classList.toggle('fas');
                    heartButton.classList.toggle('far');
    
                    if (heartButton.classList.contains('active')) {
                        likes++;
                        alert('공감을 눌렀습니다.');
                    } else {
                        likes--;
                        alert('공감을 취소했습니다.');
                    }
    
                    likeCount.textContent = likes;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }
    

    function deletePost(postId) {
        const url = `${apiUrl}${postId}/`;

        fetch(url, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log("게시글을 성공적으로 삭제하셨습니다!");
            window.location.href = './community_all.html';
        })
        .catch(error => {
            console.error('삭제 실패:', error);
        });
    }

    const commentInput = document.getElementById('comment_input');
    const sendButton = document.getElementById('send_button');

    commentInput.addEventListener('input', function() {
        if (commentInput.value.trim() !== "") {
            sendButton.classList.add('active');
            sendButton.disabled = false;
        } else {
            sendButton.classList.remove('active');
            sendButton.disabled = true;
        }
    });

    sendButton.addEventListener('click', function() {
        if (!sendButton.disabled) {
            submitComment();
            console.log("Comment submitted:", commentInput.value);
            commentInput.value = ''; // 댓글 입력창 비우기
            sendButton.classList.remove('active');
            sendButton.disabled = true;
        }
    });

    function submitComment() {
        const url = `${API_SERVER_DOMAIN}posts/comment/upload/${postId}/`;
        const content = commentInput.value.trim();

        const payload = {
            content: content,
            post: postId,
            created_at: new Date().toISOString(),
            author: {
                id: usersData.id, // 실제 사용자 ID로 변경해야 함
                nickname: usersData.nickname, // 실제 사용자 닉네임으로 변경해야 함
            }
        };

        fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log("댓글을 성공적으로 작성하셨습니다!");
            commentInput.value = ''; // 댓글 입력창 비우기
            sendButton.classList.remove('active');
            sendButton.disabled = true;
            return fetch(`${apiUrl}${postId}/`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            addComments(data.comments || []);
        })
        .catch(error => {
            console.error('댓글 작성 실패:', error);
        });
    }
});
