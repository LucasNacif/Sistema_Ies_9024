document.getElementById("alumnoForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita la recarga de la página

    // Captura los valores de los campos
    const nombreAlumno = document.getElementById("nombreAlumno").value;
    const nombreMateria = document.getElementById("nombreMateria").value;
    const estadoActual = document.getElementById("estadoActual").value;

    // Define los datos a enviar
    const data = {
        nombreAlumno,
        nombreMateria,
        estadoActual
    };

    try {
        // Realiza la petición fetch
        const response = await fetch('/alumnoEstado/agregar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // Maneja la respuesta en caso de éxito
            const result = await response.json();
            alert("Datos guardados correctamente");
            console.log("Respuesta del servidor:", result);
        } else {
            // Maneja el error si la petición falla
            alert("Error al guardar los datos");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Ocurrió un error al intentar guardar los datos");
    }
});






let alumnoEstadoIdToDelete;
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





//ELIMINAR MODAL Y TODA LA COSA

// Abrir el modal de confirmación para dar de baja carrera

// Función para abrir el modal de confirmación

// Función para abrir el modal de confirmación
window.openDeleteModal = function (id) {
    console.log("ID recibido:", id); // Muestra el ID recibido en la consola
    alumnoEstadoIdToDelete = id; // Asigna el ID al hacer clic
    $('#confirmDeleteModal').modal('show'); // Muestra el modal
};

// Evento para confirmar la eliminación
document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
    console.log("Eliminando ID:", alumnoEstadoIdToDelete);
    fetch(`/alumnoEstado/eliminar/${alumnoEstadoIdToDelete}`, { method: 'DELETE' }) // Realiza la solicitud DELETE
        .then(response => {
            if (response.ok) {
                showMessage('Alumno dada de baja de su estado correctamente', 'success');
                $('#confirmDeleteModal').modal('hide'); // Oculta el modal
                cargarEstados(); // Opcional: recargar la lista de estados
            } else {
                showMessage('Error al dar de baja el estado', 'danger');
            }
        })
        .catch(error => console.error('Error al dar de baja el estado:', error));
});
