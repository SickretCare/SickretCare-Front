document.addEventListener('DOMContentLoaded', function() {
    // 평점 데이터를 백엔드에서 받아왔다고 가정
    const ratingData = [
        { id: 1, rating: 3.5 },
        { id: 2, rating: 5 } // 예시: 첫 번째 상품의 평점이 3.5
    ];

    // 별점을 생성하는 함수
    function createStars(rating, elementId) {
        const starContainer = document.getElementById(elementId);
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - Math.ceil(rating);

        for (let i = 0; i < fullStars; i++) {
            starContainer.innerHTML += '<i class="fas fa-star"></i>';
        }

        if (halfStar) {
            starContainer.innerHTML += '<i class="fas fa-star-half-alt"></i>';
        }

        for (let i = 0; i < emptyStars; i++) {
            starContainer.innerHTML += '<i class="far fa-star"></i>';
        }
    }

    // 평점 데이터를 사용하여 별점을 생성
    ratingData.forEach(item => {
        createStars(item.rating, `rating-${item.id}`);
    });
});