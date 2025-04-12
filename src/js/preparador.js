document.addEventListener('DOMContentLoaded', () => {
    const pedidos = [
        { id: '001', cliente: 'Juan Pérez', estado: 'Pendiente', productos: [
            { nombre: 'Producto A', cantidad: 5, codigo: '12345' },
            { nombre: 'Producto B', cantidad: 3, codigo: '67890' }
        ]},
        { id: '002', cliente: 'María López', estado: 'Pendiente', productos: [
            { nombre: 'Producto C', cantidad: 2, codigo: '54321' },
            { nombre: 'Producto D', cantidad: 4, codigo: '09876' }
        ]}
    ];

    const tablaPedidos = document.getElementById('tabla-pedidos');
    const tablaProductos = document.getElementById('tabla-productos');
    const detallesPedido = document.getElementById('detalles-pedido');
    const pedidosSection = document.getElementById('pedidos');
    const marcarListoBtn = document.getElementById('marcar-listo');
    const confirmarBtn = document.getElementById('confirmar');
    const retrocederBtn = document.getElementById('retroceder');

    // Cargar pedidos pendientes
    const cargarPedidos = () => {
        tablaPedidos.innerHTML = '';
        pedidos.forEach(pedido => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="py-2 px-4">${pedido.id}</td>
                <td class="py-2 px-4">${pedido.cliente}</td>
                <td class="py-2 px-4 estado-pedido">${pedido.estado}</td>
                <td class="py-2 px-4">
                    <button class="bg-blue-500 text-white px-2 py-1 rounded ver-detalles" data-id="${pedido.id}">Ver Productos</button>
                </td>
            `;
            tablaPedidos.appendChild(tr);
        });
    };

    // Mostrar detalles del pedido
    const mostrarDetallesPedido = (idPedido) => {
        const pedido = pedidos.find(p => p.id === idPedido);
        if (!pedido) return;

        tablaProductos.innerHTML = '';
        pedido.productos.forEach(producto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="py-2 px-4">${producto.nombre}</td>
                <td class="py-2 px-4">${producto.cantidad}</td>
                <td class="py-2 px-4">${producto.codigo}</td>
                <td class="py-2 px-4">
                    <input type="text" class="border p-2 w-full verificar-codigo" placeholder="Código">
                    <input type="number" class="border p-2 w-full verificar-cantidad mt-2" placeholder="Cantidad">
                </td>
            `;
            tablaProductos.appendChild(tr);
        });

        pedidosSection.classList.add('hidden');
        detallesPedido.classList.remove('hidden');
        marcarListoBtn.classList.add('hidden'); // Ocultar el botón hasta que se confirme
    };

    // Verificar productos al confirmar
    confirmarBtn.addEventListener('click', () => {
        const filas = tablaProductos.querySelectorAll('tr');
        let todosCorrectos = true;

        filas.forEach((fila, index) => {
            const inputCodigo = fila.querySelector('.verificar-codigo');
            const inputCantidad = fila.querySelector('.verificar-cantidad');
            const producto = pedidos.find(p => p.productos[index]).productos[index];

            if (inputCodigo.value !== producto.codigo || parseInt(inputCantidad.value) !== producto.cantidad) {
                todosCorrectos = false;
            }
        });

        if (todosCorrectos) {
            alert('Estado cambiado: Listo para Entrega');
            marcarListoBtn.classList.remove('hidden'); // Mostrar el botón para marcar como listo
        } else {
            alert('Datos incorrectos. Por favor, corregir.');
        }
    });

    // Marcar pedido como listo para entrega
    marcarListoBtn.addEventListener('click', () => {
        const idPedido = tablaProductos.querySelector('.verificar-codigo').dataset.codigo;
        const pedido = pedidos.find(p => p.id === idPedido);
        if (pedido) {
            pedido.estado = 'Listo para Entrega';
            alert(`El pedido ${pedido.id} está listo para entrega.`);
            detallesPedido.classList.add('hidden');
            pedidosSection.classList.remove('hidden');
            cargarPedidos(); // Recargar la lista de pedidos con el estado actualizado
        }
    });

    // Retroceder a la lista de pedidos
    retrocederBtn.addEventListener('click', () => {
        detallesPedido.classList.add('hidden');
        pedidosSection.classList.remove('hidden');
        cargarPedidos(); // Asegurar que los cambios en el estado se reflejen al regresar
    });

    // Manejar clic en "Ver Productos"
    tablaPedidos.addEventListener('click', (e) => {
        if (e.target.classList.contains('ver-detalles')) {
            const idPedido = e.target.dataset.id;
            mostrarDetallesPedido(idPedido);
        }
    });

    cargarPedidos();
});
