document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://3.36.216.93:8000/posts/get/';
    const postId = getPostIdFromUrl();

    if (postId) {
        fetchPostDetails(postId);
    } else {
        console.error('No post ID found in URL');
    }

    function getPostIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

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
                displayPostDetails(data.post);
            })
            .catch(error => {
                console.error('Error fetching post details:', error);
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

        profileImage.src = './img/profile.png'; // 프로필 이미지
        userNickname.textContent = post.author.nickname;
        communityDetailDate.textContent = new Date(post.created_at).toLocaleDateString();
        detailTitle.textContent = post.title;
        detailContent.textContent = post.content;
        detailHashtag.textContent = `#${post.category.name}`;
        likeCount.textContent = post.likes_num;

        setupLikeButton(post.likes_num); // 좋아요 버튼 설정
    }

    function setupLikeButton(initialLikes) {
        const heartButton = document.getElementById('heart');
        const likeCount = document.getElementById('like-count');
        let likes = initialLikes;

        heartButton.classList.toggle('active', likes > 0);
        heartButton.classList.toggle('fas', likes > 0);
        heartButton.classList.toggle('far', likes <= 0);

        heartButton.addEventListener('click', function() {
            heartButton.classList.toggle('active');
            heartButton.classList.toggle('fas');
            heartButton.classList.toggle('far');

            if (heartButton.classList.contains('active')) {
                likes++;
            } else {
                likes--;
            }

            likeCount.textContent = likes;

            // 서버에 좋아요 수를 업데이트하는 요청을 추가할 수 있습니다.
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
            // 댓글을 서버에 제출하는 로직을 추가할 수 있습니다.
            console.log("Comment submitted:", commentInput.value);
            commentInput.value = ''; // 댓글 입력창 비우기
            sendButton.classList.remove('active');
            sendButton.disabled = true;
        }
    });
});
