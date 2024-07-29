document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.querySelector('.menu-icon');
    const dropdownBox = document.querySelector('.dropdown-menu');

    menuIcon.addEventListener('click', () => {
        menuIcon.classList.toggle('open');
        dropdownBox.classList.toggle('open');
    });
});
