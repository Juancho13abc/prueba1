document.addEventListener('DOMContentLoaded', () => {
    const productos = document.querySelectorAll('.productos-container > div');
    const carrito = [];

    productos.forEach((producto) => {
        const botonCarrito = producto.querySelector('.boton-carrito');
        const botonAumentar = producto.querySelector('.boton-aumentar');
        const botonEliminar = producto.querySelector('.boton-eliminar');
        const botonBasura = producto.querySelector('.boton-basura');
        const inputCantidad = producto.querySelector('input');
        const contadorContainer = producto.querySelector('.contador-container');

        let cantidad = 0;

        const actualizarCantidad = () => {
            inputCantidad.value = cantidad;
            contadorContainer.style.display = cantidad > 0 ? 'flex' : 'none';
            botonEliminar.style.display = cantidad > 1 ? 'inline-block' : 'none';
            botonBasura.style.display = cantidad === 1 ? 'inline-block' : 'none';
        };

        const reiniciarProducto = () => {
            cantidad = 0;
            actualizarCantidad();
        };

        const sincronizarProducto = () => {
            const nombre = producto.querySelector('h2').textContent;
            const productoEnCarrito = carrito.find(item => item.nombre === nombre);

            if (productoEnCarrito) {
                cantidad = productoEnCarrito.cantidad;
            } else {
                cantidad = 0;
            }
            actualizarCantidad();
        };

        const actualizarTextoBotonCarrito = () => {
            const nombre = producto.querySelector('h2').textContent;
            const productoEnCarrito = carrito.find(item => item.nombre === nombre);
            botonCarrito.textContent = productoEnCarrito ? 'Añadido al carrito' : 'Añadir al carrito';
        };

        botonCarrito.addEventListener('click', () => {
            const nombre = producto.querySelector('h2').textContent;
            const precioTexto = producto.querySelector('p').textContent;
            const precioNumerico = parseFloat(precioTexto.replace(/[^0-9.]/g, ''));
            const imagen = producto.querySelector('img')?.src.replace(window.location.origin, '') || 'src/assets/default-image.jpg';

            const productoExistente = carrito.find(item => item.nombre === nombre);

            if (productoExistente) {
                productoExistente.cantidad++; // Aumentar la cantidad si ya existe
                cantidad = productoExistente.cantidad;
            } else {
                cantidad = 1; // Iniciar con 1 si es un nuevo producto
                carrito.push({ nombre, precioTexto, precioNumerico, cantidad, imagen });
            }

            actualizarCantidad();
            sincronizarCarrito();
            actualizarTextoBotonCarrito(); // Actualizar el texto del botón
        });

        botonAumentar.addEventListener('click', () => {
            cantidad++;
            actualizarCantidad();

            const nombre = producto.querySelector('h2').textContent;
            const productoExistente = carrito.find(item => item.nombre === nombre);

            if (productoExistente) {
                productoExistente.cantidad = cantidad;
            }

            sincronizarCarrito();
        });

        botonEliminar.addEventListener('click', () => {
            if (cantidad > 1) {
                cantidad--;
                actualizarCantidad();

                const nombre = producto.querySelector('h2').textContent;
                const productoExistente = carrito.find(item => item.nombre === nombre);

                if (productoExistente) {
                    productoExistente.cantidad = cantidad;
                }

                sincronizarCarrito();
            }
        });

        botonBasura.addEventListener('click', () => {
            reiniciarProducto();

            const nombre = producto.querySelector('h2').textContent;
            const index = carrito.findIndex(item => item.nombre === nombre);
            if (index !== -1) {
                carrito.splice(index, 1);
            }

            sincronizarCarrito();
            actualizarTextoBotonCarrito(); // Actualizar el texto del botón al eliminar
        });

        inputCantidad.addEventListener('input', (e) => {
            const valor = parseInt(e.target.value, 10);
            cantidad = isNaN(valor) || valor < 0 ? 0 : valor;
            actualizarCantidad();

            const nombre = producto.querySelector('h2').textContent;
            const precioTexto = producto.querySelector('p').textContent;
            const precioNumerico = parseFloat(precioTexto.replace(/[^0-9.]/g, ''));
            const imagen = producto.querySelector('img')?.src.replace(window.location.origin, '') || 'src/assets/default-image.jpg';

            const productoExistente = carrito.find(item => item.nombre === nombre);

            if (productoExistente) {
                productoExistente.cantidad = cantidad;
                if (cantidad === 0) {
                    const index = carrito.findIndex(item => item.nombre === nombre);
                    carrito.splice(index, 1);
                }
            } else if (cantidad > 0) {
                carrito.push({ nombre, precioTexto, precioNumerico, cantidad, imagen });
            }

            sincronizarCarrito();
        });

        sincronizarProducto();
        actualizarTextoBotonCarrito(); // Actualizar el texto del botón al cargar la página
    });

    const sincronizarCarrito = () => {
        const carritoLista = document.querySelector('.carrito-lista');
        const carritoTotal = document.querySelector('.carrito-total');
        carritoLista.innerHTML = '';
        let total = 0;

        carrito.forEach((producto, index) => {
            const item = document.createElement('li');
            item.classList.add('carrito-item');
            item.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}" class="carrito-item-imagen">
                <div class="carrito-item-detalles">
                    <p class="carrito-item-nombre">${producto.nombre}</p>
                    <p class="carrito-item-precio">${producto.cantidad} x ${producto.precioTexto}</p>
                </div>
                <div class="carrito-item-controles">
                    <button class="boton-eliminar" data-index="${index}">-</button>
                    <button class="boton-aumentar" data-index="${index}">+</button>
                    <button class="boton-basura" data-index="${index}">🗑️</button>
                </div>
            `;
            carritoLista.appendChild(item);
            total += producto.cantidad * producto.precioNumerico;

            // Funcionalidad del botón de papelera
            const botonBasuraCarrito = item.querySelector('.boton-basura');
            botonBasuraCarrito.addEventListener('click', () => {
                const nombre = producto.nombre;
                carrito.splice(index, 1); // Eliminar el producto del carrito

                // Sincronizar la lista de productos
                const productoEnLista = Array.from(productos).find(p => p.querySelector('h2').textContent === nombre);
                if (productoEnLista) {
                    const inputCantidad = productoEnLista.querySelector('input');
                    const contadorContainer = productoEnLista.querySelector('.contador-container');
                    const botonEliminar = productoEnLista.querySelector('.boton-eliminar');
                    const botonBasura = productoEnLista.querySelector('.boton-basura');
                    const botonCarrito = productoEnLista.querySelector('.boton-carrito');

                    inputCantidad.value = 0;
                    contadorContainer.style.display = 'none';
                    botonEliminar.style.display = 'none';
                    botonBasura.style.display = 'none';

                    // Actualizar el texto del botón a "Añadir al carrito"
                    botonCarrito.textContent = 'Añadir al carrito';
                }

                sincronizarCarrito(); // Actualizar el carrito
            });

            // Funcionalidad de los botones de aumentar y eliminar en el carrito
            const botonAumentarCarrito = item.querySelector('.boton-aumentar');
            const botonEliminarCarrito = item.querySelector('.boton-eliminar');

            botonAumentarCarrito.addEventListener('click', () => {
                carrito[index].cantidad++;
                sincronizarCarrito();
            });

            botonEliminarCarrito.addEventListener('click', () => {
                if (carrito[index].cantidad > 1) {
                    carrito[index].cantidad--;
                } else {
                    carrito.splice(index, 1);
                }
                sincronizarCarrito();
            });
        });

        carritoTotal.textContent = `$${total.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

        // Sincronizar cantidades en la lista de productos
        productos.forEach(producto => {
            const nombre = producto.querySelector('h2').textContent;
            const productoEnCarrito = carrito.find(item => item.nombre === nombre);
            const inputCantidad = producto.querySelector('input');
            const contadorContainer = producto.querySelector('.contador-container');
            const botonEliminar = producto.querySelector('.boton-eliminar');
            const botonBasura = producto.querySelector('.boton-basura');
            const botonCarrito = producto.querySelector('.boton-carrito');

            if (productoEnCarrito) {
                inputCantidad.value = productoEnCarrito.cantidad;
                contadorContainer.style.display = 'flex';
                botonEliminar.style.display = productoEnCarrito.cantidad > 1 ? 'inline-block' : 'none';
                botonBasura.style.display = productoEnCarrito.cantidad === 1 ? 'inline-block' : 'none';
                botonCarrito.textContent = 'Añadido al carrito';
            } else {
                inputCantidad.value = 0;
                contadorContainer.style.display = 'none';
                botonCarrito.textContent = 'Añadir al carrito'; // Actualizar el texto del botón
            }
        });
    };

    const menuIcon = document.querySelector('.menu-icon');
    const menuLateral = document.querySelector('.menu-lateral');
    const menuCerrar = document.querySelector('.menu-cerrar');

    menuIcon.addEventListener('click', () => {
        menuLateral.classList.add('visible');
    });

    menuCerrar.addEventListener('click', () => {
        menuLateral.classList.remove('visible');
    });

    const carritoIcon = document.querySelector('.fa-shopping-cart');
    const carritoLateral = document.querySelector('.carrito-lateral');
    const carritoCerrar = document.querySelector('.carrito-cerrar');

    carritoIcon.addEventListener('click', () => {
        carritoLateral.classList.add('visible');
        sincronizarCarrito(); // Sincronizar el carrito al abrirlo
    });

    carritoCerrar.addEventListener('click', () => {
        carritoLateral.classList.remove('visible');
    });

    // Mostrar y ocultar el submenú de productos
    const productosLink = document.getElementById('productos-link');
    const subMenuProductos = document.getElementById('sub-menu-productos');

    productosLink.addEventListener('click', (e) => {
        e.preventDefault(); // Evitar el comportamiento predeterminado del enlace
        const isVisible = subMenuProductos.style.display === 'grid';
        subMenuProductos.style.display = isVisible ? 'none' : 'grid'; // Alternar entre 'grid' y 'none'
    });
});
