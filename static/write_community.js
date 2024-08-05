document.addEventListener("DOMContentLoaded", function () {
  const titleInput = document.getElementById("title_input");
  const contentInput = document.getElementById("content_input");
  const hashtagButtons = document.querySelectorAll(".hashtag-btn");
  const saveButton = document.getElementById("save_btn");

  let selectedHashtag = null;

  function updateSaveButtonState() {
    const isTitleFilled = titleInput.value.trim() !== "";
    const isContentFilled = contentInput.value.trim() !== "";
    const isHashtagSelected = selectedHashtag !== null;

    if (isTitleFilled && isContentFilled && isHashtagSelected) {
      saveButton.classList.add("active");
      saveButton.disabled = false;
    } else {
      saveButton.classList.remove("active");
      saveButton.disabled = true;
    }
  }

  titleInput.addEventListener("input", updateSaveButtonState);
  contentInput.addEventListener("input", updateSaveButtonState);

  hashtagButtons.forEach((button) => {
    button.addEventListener("click", function () {
      if (selectedHashtag === this) {
        selectedHashtag.classList.remove("selected");
        selectedHashtag = null;
      } else {
        if (selectedHashtag) {
          selectedHashtag.classList.remove("selected");
        }
        selectedHashtag = this;
        selectedHashtag.classList.add("selected");
      }
      updateSaveButtonState();
    });
  });

  // 쿠키에서 accessToken을 가져오는 함수
  function getCookie(name) {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  // accessToken 가져오기
  const accessToken = getCookie("access_token");

  saveButton.addEventListener("click", async function () {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const category = selectedHashtag
      ? selectedHashtag.textContent.trim().replace("#", "")
      : "";

    const data = {
      title: title,
      content: content,
      category: category,
    };

    console.log(data);

    const API_SERVER_DOMAIN = "http://3.36.216.93:8000/";

    try {
      const response = await fetch(API_SERVER_DOMAIN + "posts/upload/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (response.status === 201) {
        const result = await response.json();
        console.log("성공:", result);
        window.location.href = "./community_all.html";
      } else if (response.status === 401) {
        alert("로그인이 필요합니다.");
        window.location.href = "./main.html";
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "게시글 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("에러 발생:", error);
      alert(error.message);
    }
  });

  updateSaveButtonState();
});
