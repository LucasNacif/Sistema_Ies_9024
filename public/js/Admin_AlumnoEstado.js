$('#modifyAlumnoEstadoModal').on('shown.bs.modal', function () {
    $('#modificarNombreMateria').trigger('focus'); // Mueve el foco al input de nombre de materia
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




// Variables globales para modificar
let idAlumnoEstadoToModify;

// Función para modificar el estado del alumno
window.modificarEstadoAlumno = function (idAlumnoEstado) {
    fetch(`/alumnoEstado/buscar/${idAlumnoEstado}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(alumnoEstado => {
            idAlumnoEstadoToModify = idAlumnoEstado;

            // Llenar el formulario de modificación
            document.getElementById('modificarNombreMateria').value = alumnoEstado.nombreMateria || '';
            document.getElementById('modificarEstadoActual').value = alumnoEstado.estadoActual || '';
            document.getElementById('idAlumnoEstado').value = idAlumnoEstado; // Asegúrate de tener un campo oculto para el ID

            // Abrir el modal de modificación
            $('#modifyAlumnoEstadoModal').modal('show');
        })
        .catch(error => console.error('Error al cargar los datos del estado del alumno:', error));
};

// Enviar los datos modificados al servidor
document.getElementById('formModificarAlumnoEstado').addEventListener('submit', function (event) {
    event.preventDefault();
    const nombreMateria = document.getElementById('modificarNombreMateria').value;
    const estadoActual = document.getElementById('modificarEstadoActual').value;

    fetch(`/alumnoEstado/modificar/${idAlumnoEstadoToModify}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreMateria, estadoActual })
    })
        .then(response => {
            if (response.ok) {
                showMessage('Estado del alumno modificado correctamente', 'success');
                cargarEstadoAlumnos(); // Recargar la lista de estados de alumnos, esta función debe ser implementada
                $('#modifyAlumnoEstadoModal').modal('hide'); // Cerrar el modal
            } else {
                showMessage('Error al modificar el estado del alumno', 'danger');
            }
        })
        .catch(error => console.error('Error al modificar el estado del alumno:', error));
});



// Esta función se activa al hacer clic en el botón "Dar De Baja" dentro del modal
function eliminarEstado(id) {
    fetch(`/alumnoEstado/eliminar/${id}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el estado');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            // Elimina la fila correspondiente de la tabla
            document.getElementById(`fila-${id}`).remove(); // Asegúrate de que cada fila tenga un ID único
        })
        .catch(err => {
            console.error(err);
            alert('Ocurrió un error al intentar eliminar el estado');
        });
}

// Escuchar el evento de clic para el botón de confirmación en el modal
document.addEventListener('DOMContentLoaded', () => {
    const confirmDeleteButtons = document.querySelectorAll('[id^="confirmDeleteBtn-"]');

    confirmDeleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const id = this.id.split('-')[1]; // Extrae el ID del botón
            eliminarEstado(id); // Llama a la función para eliminar el estado
        });
    });
});

