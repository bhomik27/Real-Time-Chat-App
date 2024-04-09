document.addEventListener('DOMContentLoaded', function () {
    const navbarToggle = document.getElementById('navbarToggle');
    const verticalNavbar = document.querySelector('.vertical-navbar');

    navbarToggle.addEventListener('click', function () {
        verticalNavbar.classList.toggle('show-navbar');
    });
});
