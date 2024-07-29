document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".bottom-nav a");
  const currentPage = getCurrentPage();

  function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf("/") + 1);
    return page.replace(".html", "") || "alarm-set";
  }

  function setActivePage(page) {
    navLinks.forEach((link) => {
      if (link.dataset.page === page) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  setActivePage(currentPage);

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const page = this.dataset.page;
      setActivePage(page);
      window.location.href = this.href;
    });
  });
});
