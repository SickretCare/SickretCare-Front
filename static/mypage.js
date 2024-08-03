document.addEventListener("DOMContentLoaded", async function () {
    const profileEmail = document.querySelector(".profile-email");
    const profileName = document.querySelector(".profile-name");
    const profileNickname = document.querySelector(".profile-nickname");

    // 쿠키에서 accessToken을 가져오는 함수
    function getCookie(name) {
        let value = `; ${document.cookie}`;
        let parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    // accessToken 가져오기
    const accessToken = getCookie("accessToken");
    
    const API_SERVER_DOMAIN = 'http://3.36.216.93:8000/';
  
    try {
        const response = await fetch(API_SERVER_DOMAIN + 'users/', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        
        console.log(response);

        if (response.status === 200) {
            const result = await response.json();
            profileEmail.textContent = result.email;
            profileName.textContent = result.username; 
            profileNickname.textContent = result.nickname;
        } else if (response.status === 401) {
            alert('로그인이 필요합니다.');
            window.location.href = './login.html';
        } else {
            alert('회원 정보를 불러오는 데 실패했습니다.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('서버와의 통신 중 오류가 발생했습니다.');
    }
});
