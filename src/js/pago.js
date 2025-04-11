document.addEventListener('DOMContentLoaded', () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const pagoDetalles = document.getElementById('pago-detalles');
    const totalProductosElement = document.getElementById('total-productos');
    const costoEnvioElement = document.getElementById('costo-envio');
    const totalFinal = document.getElementById('total-final');
    const costoEnvio = 5.000;

    const sincronizarCarrito = () => {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
    };

    const renderizarCarrito = () => {
        pagoDetalles.innerHTML = '';
        let totalProductos = 0;

        carrito.forEach((producto, index) => {
            const codigoProducto = producto.codigo || 'N/A'; // Obtener el código del producto o un valor predeterminado
            const item = document.createElement('div');
            item.innerHTML = `
                <div class="carrito-item">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="carrito-item-imagen">
                    <div class="carrito-item-detalles">
                        <p><strong>Producto:</strong> ${producto.nombre}</p>
                        <p><strong>Precio por unidad:</strong> $${producto.precioNumerico.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p>
                        <p><strong>Cantidad:</strong> ${producto.cantidad}</p>
                        <p><strong>Total:</strong> $${(producto.cantidad * producto.precioNumerico).toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p>
                        <p><strong>Código:</strong> ${codigoProducto}</p>
                    </div>
                    <div class="carrito-item-codigo">
                        <p><strong>Código de barras:</strong></p>
                        <img src="https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(codigoProducto)}&code=Code128&translate-esc=true" alt="Código de barras">
                    </div>
                    <div class="carrito-item-controles">
                        <button class="boton-eliminar" data-index="${index}">-</button>
                        <button class="boton-aumentar" data-index="${index}">+</button>
                        <button class="boton-basura" data-index="${index}">🗑️</button>
                    </div>
                </div>
                <hr>
            `;
            pagoDetalles.appendChild(item);
            totalProductos += producto.cantidad * producto.precioNumerico;

            // Funcionalidad de los botones
            const botonAumentar = item.querySelector('.boton-aumentar');
            const botonEliminar = item.querySelector('.boton-eliminar');
            const botonBasura = item.querySelector('.boton-basura');

            botonAumentar.addEventListener('click', () => {
                carrito[index].cantidad++;
                sincronizarCarrito();
            });

            botonEliminar.addEventListener('click', () => {
                if (carrito[index].cantidad > 1) {
                    carrito[index].cantidad--;
                } else {
                    carrito.splice(index, 1);
                }
                sincronizarCarrito();
            });

            botonBasura.addEventListener('click', () => {
                carrito.splice(index, 1);
                sincronizarCarrito();
            });
        });

        // Mostrar el precio total de los productos
        totalProductosElement.textContent = `$${totalProductos.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

        // Mostrar el costo de envío
        costoEnvioElement.textContent = `$${costoEnvio.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

        // Calcular el total a pagar (productos + costo de envío)
        const totalConEnvio = totalProductos > 0 ? totalProductos + costoEnvio : 0;
        totalFinal.textContent = `$${totalConEnvio.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    };

    renderizarCarrito();

    const direccionBtn = document.getElementById('direccion-entrega-btn');
    const direccionLateral = document.getElementById('direccion-lateral');
    const direccionCerrar = document.getElementById('direccion-cerrar');
    const guardarDireccionBtn = document.getElementById('guardar-direccion');
    const direccionResumen = document.getElementById('direccion-resumen');

    direccionBtn.addEventListener('click', () => {
        direccionLateral.classList.add('visible');
    });

    direccionCerrar.addEventListener('click', () => {
        direccionLateral.classList.remove('visible');
    });

    // Mostrar automáticamente la dirección guardada en el resumen si existe
    const direccionGuardada = localStorage.getItem('direccion');
    if (direccionGuardada && direccionGuardada.trim() !== '') {
        direccionResumen.textContent = direccionGuardada;
        direccionResumen.style.display = 'block'; // Mostrar el resumen
    }

    guardarDireccionBtn.addEventListener('click', () => {
        const departamento = document.getElementById('departamento').value;
        const municipio = document.getElementById('municipio').value;
        const tipoDireccion = document.getElementById('tipo-direccion').value;
        const calle = document.getElementById('calle').value;
        const numero1 = document.getElementById('numero1').value;
        const numero2 = document.getElementById('numero2').value;
        const barrio = document.getElementById('barrio').value;
        const piso = document.getElementById('piso').value;
        const nombreRecibe = document.getElementById('nombre-recibe').value;

        if (departamento && municipio && tipoDireccion && calle && numero1 && barrio && nombreRecibe) {
            const direccionCompleta = `${municipio}, ${departamento}, ${tipoDireccion} ${calle} #${numero1}-${numero2}, Barrio ${barrio}${piso ? `, ${piso}` : ''} - Recibe: ${nombreRecibe}`;
            direccionResumen.textContent = direccionCompleta;
            direccionResumen.style.display = 'block'; // Mostrar el resumen
            localStorage.setItem('direccion', direccionCompleta); // Guardar la dirección en localStorage
        } else {
            alert('Por favor complete todos los campos obligatorios.');
            direccionResumen.style.display = 'none'; // Ocultar el resumen si faltan datos
        }
    });

    const calcularTotales = () => {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        let subtotal = 0;

        carrito.forEach(producto => {
            subtotal += producto.cantidad * producto.precioNumerico;
        });

        const envio = subtotal > 0 ? 5.000 : 0; // Solo sumar costo de envío si hay productos
        const total = subtotal + envio;

        totalProductosElement.textContent = `$${subtotal.toFixed(3)}`;
        costoEnvioElement.textContent = `$${envio.toFixed(3)}`;
        totalFinal.textContent = `$${total.toFixed(3)}`;

        localStorage.setItem('subtotal', subtotal);
        localStorage.setItem('costoEnvio', envio);
        localStorage.setItem('total', total);
    };

    calcularTotales();

    const generarFacturaBtn = document.getElementById('generar-factura');
    const facturaContainer = document.getElementById('factura');
    const facturaDireccion = document.getElementById('factura-direccion');
    const facturaProductos = document.getElementById('factura-productos');
    const facturaTotal = document.getElementById('factura-total');
    const descargarPdfBtn = document.getElementById('descargar-pdf');

    generarFacturaBtn.addEventListener('click', () => {
        const direccion = localStorage.getItem('direccion');
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

        if (!direccion || direccion.trim() === '') {
            alert('Por favor, complete la dirección de entrega antes de generar la factura.');
            return;
        }

        if (carrito.length === 0) {
            alert('No hay productos en el carrito. Por favor, añada productos antes de generar la factura.');
            return;
        }

        window.location.href = 'factura.html'; // Redirigir a la página de factura
    });

    descargarPdfBtn.addEventListener('click', () => {
        const facturaHtml = facturaContainer.innerHTML;
        const opt = {
            margin: 1,
            filename: 'factura.pdf',
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(facturaHtml).set(opt).save();
    });

    // Limpiar la dirección al cargar la página para evitar reutilización
    localStorage.removeItem('direccion');
});
