document.addEventListener('DOMContentLoaded', function() {
    const API_SERVER_DOMAIN = 'http://3.36.216.93:8000/';
    const shopContainer = document.querySelector('.shop_container');
    let allProducts = [];

    // 쿠키에서 accessToken을 가져오는 함수
    function getCookie(name) {
        let value = `; ${document.cookie}`;
        let parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    }
    // accessToken 가져오기
    const accessToken = getCookie("access_token");

    function createStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - Math.ceil(rating);
        let starsHtml = '';

        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }

        if (halfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }

        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }

        return starsHtml;
    }

    function createProductTab(product) {
        const productTab = document.createElement('div');
        productTab.classList.add('shop_tab');
        productTab.innerHTML = `
            <img src="${product.image_link}" alt="상품 사진" />
            <span>${truncateText(product.title, 17)}</span>
            <span><span>${product.price.toLocaleString()}</span>원</span>
            <div class="stars">${createStars(product.stars)}</div>
        `;
        productTab.addEventListener('click', function() {
            window.location.href = product.link;
        });
        shopContainer.appendChild(productTab);
    }

    function displayProducts(products) {
        shopContainer.innerHTML = ''; // 기존 제품 목록을 초기화
        products.forEach(product => {
            createProductTab(product);
        });
    }

    function fetchProducts() {
        fetch(`${API_SERVER_DOMAIN}posts/commodity/list/`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            allProducts = data;
            displayProducts(allProducts);
        })
        .catch(error => console.error('Error fetching products:', error));
    }

    function filterProducts(category) {
        if (category === '') {
            displayProducts(allProducts);
        } else {
            const filteredProducts = allProducts.filter(product => product.category.name === category);
            displayProducts(filteredProducts);
        }
    }

    function activateButton(button) {
        document.querySelectorAll('.hashtag_button').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
    }

    document.querySelectorAll('.hashtag_button').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            filterProducts(category);
            activateButton(this);
        });
    });

    document.getElementById('hashtag_all').addEventListener('click', function() {
        filterProducts('');
        activateButton(this);
    });

    // "모두 보기" 버튼을 처음부터 활성화 상태로 설정
    const allButton = document.getElementById('hashtag_all');
    allButton.classList.add('active');

    // 페이지 로드 시 전체 제품 목록을 가져옴
    fetchProducts();
});

//텍스트를 일정 길이로 자르고 '...'을 추가하는 함수
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
}

