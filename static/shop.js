document.addEventListener('DOMContentLoaded', function() {
    const API_SERVER_DOMAIN = 'http://3.36.216.93:8000/';
    const shopContainer = document.querySelector('.shop_container');
    let allProducts = [];

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
            <span>${product.title}</span>
            <span><span>${product.price.toLocaleString()}</span>원</span>
            <div class="stars">${createStars(product.stars)}</div>
        `;
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
                'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzIyNTM1OTYyLCJpYXQiOjE3MjI1MzUwNjIsImp0aSI6ImZjYjdkMzQxZjhlYzQwN2RhYzYxMjhmOWIwOGJiMWIyIiwidXNlcl9pZCI6MX0.qbs66A5yF8XBEneWnMqTXOcbjuGGQyOypp4fsLrpUZo',
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

    document.querySelectorAll('.hashtag_button').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            filterProducts(category);
        });
    });

    document.getElementById('hashtag_all').addEventListener('click', function() {
        filterProducts('');
    });

    // 페이지 로드 시 전체 제품 목록을 가져옴
    fetchProducts();
});
