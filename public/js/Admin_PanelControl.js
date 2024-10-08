document.addEventListener('DOMContentLoaded', function () {
    // Cargar carreras desde la base de datos
    cargarCarreras();
    function cargarCarreras() {
        fetch('/carrera/obtener')
            .then(response => response.json())
            .then(carreras => {
                const listaCarreras = document.getElementById('listaCarreras');
                listaCarreras.innerHTML = '';
                carreras.forEach(carrera => {
                    listaCarreras.innerHTML += `
                    <div class="col-md-4">
                        <div class="card" style="margin: 10px;">
                            <div class="card-header text-center">
                                ${carrera.nombreCarrera}
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">${carrera.titulo}</h5>
                                <p class="card-text"><strong>Carga Horaria:</strong> ${carrera.cargaHoraria} horas</p>
                                <p class="card-text"><strong>Duración:</strong> ${carrera.duracion} años</p>
                                <a href="/planEstudio/${carrera._id}" class="btn btn-info">Ver Plan de Estudios</a>
                                <button type="button" class="btn btn-warning" onclick="modificarCarrera('${carrera._id}')">Modificar</button>
                                <button type="button" class="btn btn-danger" onclick="openDeleteModal('${carrera._id}')">Dar de baja</button>
                            </div>
                        </div>
                    </div>`;
                });
            })
            .catch(error => console.error('Error al cargar carreras:', error));
    }

    // Mostrar/Ocultar formulario de agregar carrera
    const toggleFormBtn = document.getElementById('toggleFormBtn');
    const formContainer = document.getElementById('formContainer');
    toggleFormBtn.addEventListener('click', () => {
        if (formContainer.style.display === 'none') {
            formContainer.style.display = 'block';
            toggleFormBtn.textContent = 'Ocultar formulario';
        } else {
            formContainer.style.display = 'none';
            toggleFormBtn.textContent = 'Agregar nueva carrera';
        }
    });

    // Agregar una nueva carrera
    document.getElementById('formAgregarCarrera').addEventListener('submit', function (event) {
        event.preventDefault();
        const nombreCarrera = document.getElementById('nombreCarrera').value;
        const titulo = document.getElementById('titulo').value;
        const cargaHoraria = parseInt(document.getElementById('cargaHoraria').value, 10);
        const duracion = parseInt(document.getElementById('duracion').value, 10);

        fetch('/carrera/agregar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreCarrera, titulo, cargaHoraria, duracion })
        })
            .then(response => {
                if (response.ok) {
                    showMessage('Carrera agregada correctamente', 'success');
                    cargarCarreras(); // Recargar la lista de carreras
                    document.getElementById('formAgregarCarrera').reset(); // Limpiar formulario
                } else {
                    showMessage('Error al agregar la carrera', 'danger');
                }
            })
            .catch(error => console.error('Error al agregar carrera:', error));
    });

    // Dar de baja una carrera (eliminar)
    function eliminarCarrera(idCarrera) {
        fetch(`/carrera/eliminar/${idCarrera}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    showMessage('Carrera dada de baja correctamente', 'success');
                    cargarCarreras(); // Recargar la lista de carreras
                } else {
                    showMessage('Error al dar de baja la carrera', 'danger');
                }
            })
            .catch(error => console.error('Error al dar de baja carrera:', error));
    }

    // Abrir el modal de confirmación para dar de baja carrera
    let carreraIdToDelete = null;
    window.openDeleteModal = function (id) {
        carreraIdToDelete = id;
        $('#confirmDeleteModal').modal('show');
    };

    // Asignar evento al botón "Dar de baja" del modal solo una vez
    document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
        eliminarCarrera(carreraIdToDelete);
        $('#confirmDeleteModal').modal('hide');
    });

    // Modificar una carrera (redireccionar a la página de modificación)
    window.modificarCarrera = function (idCarrera) {
        window.location.href = `/carrera/modificar/${idCarrera}`;
    };

    // Función para mostrar mensajes en pantalla
    function showMessage(message, type) {
        const messageContainer = document.createElement('div');
        messageContainer.className = `alert alert-${type}`;
        messageContainer.textContent = message;
        document.body.appendChild(messageContainer);

        // Eliminar el mensaje después de 3 segundos
        setTimeout(() => {
            messageContainer.remove();
        }, 3000);
    }

    // Cerrar sesión
    document.getElementById('logout-button').addEventListener('click', function (e) {
        e.preventDefault(); // Evitar que se recargue la página
        fetch('/index/logout', { method: 'POST', credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'ok') {
                    // Redirigir o realizar alguna acción
                    window.location.href = data.redirect;
                }
            })
            .catch(error => console.error('Error:', error));
    });
});
