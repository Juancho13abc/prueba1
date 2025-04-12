document.addEventListener('DOMContentLoaded', () => {
    const menuLinks = document.querySelectorAll('nav a[data-panel]');
    const panels = document.querySelectorAll('#panel-control > section');

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPanel = link.getAttribute('data-panel');

            // Ocultar todos los paneles
            panels.forEach(panel => panel.classList.add('hidden'));

            // Mostrar el panel seleccionado
            document.getElementById(targetPanel).classList.remove('hidden');
        });
    });
});
