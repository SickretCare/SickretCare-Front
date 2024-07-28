document.querySelectorAll(".bottom-nav a").forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    event.preventDefault();
    // 모든 아이콘과 텍스트 색상을 초기화
    document.querySelectorAll(".bottom-nav a").forEach((a) => {
      a.classList.remove("active");
    });
    // 클릭된 아이콘과 텍스트 색상을 하얀색으로 변경
    anchor.classList.add("active");
  });
});
