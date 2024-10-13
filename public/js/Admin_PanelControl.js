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

    window.agregarCarreras = function (idCarrera) {
        fetch(`/carrera/agregar/${idCarrera}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(carrera => {
                console.log('Carrera a modificar:', carrera); // Verificar la estructura del objeto
                carreraIdToModify = idCarrera;
    
                // Asegúrate de que las propiedades existan
                document.getElementById('agregarNombreCarrera').value = carrera.nombreCarrera || ''; // Agregar un valor por defecto
                document.getElementById('agregarTitulo').value = carrera.titulo || ''; // Agregar un valor por defecto
                document.getElementById('agregarCargaHoraria').value = carrera.cargaHoraria || ''; // Agregar un valor por defecto
                document.getElementById('agregarDuracion').value = carrera.duracion || ''; // Agregar un valor por defecto
    
                // Abrir el modal de modificación
                $('#addAlumnoModal').modal('show');
            })
            .catch(error => console.error('Error al agregar los datos de la carrera:', error));
    };

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

    
    // Variables globales para modificar/eliminar
    window.modificarCarrera = function (idCarrera) {
        fetch(`/carrera/obtener/${idCarrera}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(carrera => {
                console.log('Carrera a modificar:', carrera); // Verificar la estructura del objeto
                carreraIdToModify = idCarrera;
    
                // Asegúrate de que las propiedades existan
                document.getElementById('modificarNombreCarrera').value = carrera.nombreCarrera || ''; // Agregar un valor por defecto
                document.getElementById('modificarTitulo').value = carrera.titulo || ''; // Agregar un valor por defecto
                document.getElementById('modificarCargaHoraria').value = carrera.cargaHoraria || ''; // Agregar un valor por defecto
                document.getElementById('modificarDuracion').value = carrera.duracion || ''; // Agregar un valor por defecto
    
                // Abrir el modal de modificación
                $('#modifyCareerModal').modal('show');
            })
            .catch(error => console.error('Error al cargar los datos de la carrera:', error));
    };
    
    
    

    // Enviar los datos modificados al servidor
    document.getElementById('formModificarCarrera').addEventListener('submit', function (event) {
        event.preventDefault();
        const nombreCarrera = document.getElementById('modificarNombreCarrera').value;
        const titulo = document.getElementById('modificarTitulo').value;
        const cargaHoraria = parseInt(document.getElementById('modificarCargaHoraria').value, 10);
        const duracion = parseInt(document.getElementById('modificarDuracion').value, 10);

        fetch(`/carrera/modificar/${carreraIdToModify}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreCarrera, titulo, cargaHoraria, duracion })
        })
            .then(response => {
                if (response.ok) {
                    showMessage('Carrera modificada correctamente', 'success');
                    cargarCarreras(); // Recargar la lista de carreras
                    $('#modifyCareerModal').modal('hide'); // Cerrar el modal
                } else {
                    showMessage('Error al modificar la carrera', 'danger');
                }
            })
            .catch(error => console.error('Error al modificar la carrera:', error));
    });

    // Abrir el modal de confirmación para dar de baja carrera
    window.openDeleteModal = function (idCarrera) {
        carreraIdToDelete = idCarrera;
        $('#confirmDeleteModal').modal('show');
    };

    // Dar de baja una carrera (eliminar)
    document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
        fetch(`/carrera/eliminar/${carreraIdToDelete}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    showMessage('Carrera dada de baja correctamente', 'success');
                    cargarCarreras(); // Recargar la lista de carreras
                    $('#confirmDeleteModal').modal('hide');
                } else {
                    showMessage('Error al dar de baja la carrera', 'danger');
                }
            })
            .catch(error => console.error('Error al dar de baja carrera:', error));
    });

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
                    window.location.href = data.redirect;
                }
            })
            .catch(error => console.error('Error:', error));
    });
});
