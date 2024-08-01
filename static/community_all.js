document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('.write_btn').addEventListener('click', function() {
        window.location.href = './write_community.html';
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const hashtagAllBtn = document.getElementById('hashtag_all');
    const hashtagButtons = document.querySelectorAll('.hashtag_container button');
    const sortLinks = document.querySelectorAll('.sort_buttons .sort-link');

    function selectHashtagButton(button) {
        console.log("Selecting button:", button.textContent);
        hashtagButtons.forEach(btn => btn.classList.remove('selected-button'));
        button.classList.add('selected-button');
    }

    function selectSortLink(link) {
        console.log("Selecting link:", link.textContent);
        sortLinks.forEach(lnk => lnk.classList.remove('active'));
        link.classList.add('active');
    }

    // 기본적으로 '모두 보기' 버튼과 '최신순' 링크 선택
    selectHashtagButton(hashtagAllBtn);
    selectSortLink(document.querySelector('.sort_buttons .sort-link.active'));

    // 해시태그 버튼 선택 이벤트 핸들러
    hashtagButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log("Button clicked:", btn.textContent);
            selectHashtagButton(btn);
        });
    });

    // 정렬 링크 선택 이벤트 핸들러
    sortLinks.forEach(lnk => {
        lnk.addEventListener('click', (event) => {
            event.preventDefault(); // 기본 링크 동작 방지
            console.log("Link clicked:", lnk.textContent);
            selectSortLink(lnk);
        });
    });
});
