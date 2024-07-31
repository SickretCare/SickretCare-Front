document.addEventListener('DOMContentLoaded', function() {
    const heartButton = document.getElementById('heart');
    const likeCount = document.getElementById('like-count');
    let likes = 0;

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
    });
});
document.addEventListener('DOMContentLoaded', function() {
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
            // 여기에 전송했을때 로직을 추가
        }
    });
});