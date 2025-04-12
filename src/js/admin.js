document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');

    links.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            sections.forEach(section => section.style.display = 'none');
            sections[index].style.display = 'block';
        });
    });

    document.querySelector('button').addEventListener('click', () => {
        alert('Sesión cerrada');
        window.location.href = '../index.html';
    });
});
