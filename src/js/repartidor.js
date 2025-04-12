document.addEventListener('DOMContentLoaded', () => {
    const escanearModal = document.getElementById('escanear-modal');
    const abrirCamaraBtn = document.getElementById('abrir-camara');
    const subirFotoInput = document.getElementById('subir-foto');
    const enviarImagenBtn = document.getElementById('enviar-imagen');
    let imagenSeleccionada = null;

    // Función para abrir el modal de escaneo
    window.abrirEscanearModal = () => {
        escanearModal.classList.remove('hidden');
    };

    // Función para cerrar el modal de escaneo
    window.cerrarEscanearModal = () => {
        escanearModal.classList.add('hidden');
        imagenSeleccionada = null; // Reiniciar la imagen seleccionada
        enviarImagenBtn.classList.add('hidden'); // Ocultar el botón de enviar
    };

    // Evento para abrir la cámara
    abrirCamaraBtn.addEventListener('click', () => {
        alert('Abrir cámara no está implementado en este entorno. Use un dispositivo compatible.');
    });

    // Evento para manejar la subida de una foto
    subirFotoInput.addEventListener('change', (event) => {
        const archivo = event.target.files[0];
        if (archivo) {
            imagenSeleccionada = archivo;
            alert(`Foto seleccionada: ${archivo.name}`);
            enviarImagenBtn.classList.remove('hidden'); // Mostrar el botón de enviar
        }
    });

    // Evento para enviar la imagen seleccionada
    enviarImagenBtn.addEventListener('click', () => {
        if (imagenSeleccionada) {
            const formData = new FormData();
            formData.append('imagen', imagenSeleccionada);

            // Enviar la imagen al backend
            fetch('/ruta-del-backend', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    alert('Imagen enviada correctamente.');
                    cerrarEscanearModal();
                })
                .catch(error => {
                    console.error('Error al enviar la imagen:', error);
                    alert('Hubo un error al enviar la imagen.');
                });
        } else {
            alert('No se ha seleccionado ninguna imagen.');
        }
    });
});
