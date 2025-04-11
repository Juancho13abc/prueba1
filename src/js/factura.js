document.addEventListener('DOMContentLoaded', () => {
    const facturaDireccion = document.getElementById('factura-direccion');
    const facturaTabla = document.querySelector('#factura-tabla tbody');
    const facturaSubtotal = document.getElementById('factura-subtotal');
    const facturaEnvio = document.getElementById('factura-envio');
    const facturaTotal = document.getElementById('factura-total');
    const descargarPdfBtn = document.getElementById('descargar-pdf');

    // Cargar datos de la factura desde localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const direccion = localStorage.getItem('direccion');
    const subtotal = parseFloat(localStorage.getItem('subtotal')) || 0;
    const costoEnvio = parseFloat(localStorage.getItem('costoEnvio')) || 0;
    const total = parseFloat(localStorage.getItem('total')) || 0;

    // Mostrar la dirección
    facturaDireccion.textContent = direccion || 'No especificada';

    // Mostrar los productos en la tabla de la factura
    if (carrito.length > 0) {
        carrito.forEach(producto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${producto.imagen}" alt="${producto.nombre}"></td>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>$${(producto.precioNumerico * producto.cantidad).toFixed(3)}</td>
                <td>${producto.codigo}</td>
                <td><img src="https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(producto.codigo)}&code=Code128&translate-esc=true" alt="Código de Barras"></td>
            `;
            facturaTabla.appendChild(tr);
        });
    } else {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="6" style="text-align: center;">No hay productos en el carrito</td>`;
        facturaTabla.appendChild(tr);
    }

    // Mostrar el resumen del pedido
    facturaSubtotal.textContent = `$${subtotal.toFixed(3)}`;
    facturaEnvio.textContent = `$${costoEnvio.toFixed(3)}`;
    facturaTotal.textContent = `$${total.toFixed(3)}`;

    // Descargar factura como PDF
    descargarPdfBtn.addEventListener('click', () => {
        const facturaHtml = document.querySelector('.factura-container').innerHTML;
        const opt = {
            margin: 1,
            filename: 'factura.pdf',
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(facturaHtml).set(opt).save();
    });
});
