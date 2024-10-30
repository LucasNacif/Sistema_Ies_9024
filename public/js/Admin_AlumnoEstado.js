
//Guardar un nuevo EstadoAlumno
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
let estadoId;
function openDeleteModal(id) {
    estadoId = id; // Guardar el ID del estado en la variable global
    console.log("ID del estado a eliminar:", estadoId); // Verifica que el ID se establezca correctamente
    const modal = document.getElementById('confirmDeleteModal');
    modal.style.display = 'block'; // Mostrar el modal
    modal.classList.add('show'); // Agregar clase para mostrar el modal
}

function closeModal() {
    const modal = document.getElementById('confirmDeleteModal');
    modal.style.display = 'none'; // Ocultar el modal
    modal.classList.remove('show'); // Remover clase para ocultar el modal
}

// Confirmar y realizar la solicitud fetch al hacer clic en "Dar De Baja"
document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
    //console.log("Botón de confirmación clickeado");
    if (estadoId) {
        try {
            const response = await fetch(`/alumnoEstado/eliminar/${estadoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado: 'Sin estado' }),
            });

            const result = await response.json();
            alert(result.message); // Mostrar el mensaje de respuesta
            closeModal();
            location.reload(); // Recargar la página para actualizar la vista
        } catch (error) {
            console.error('Error al actualizar el estado:', error);
        }
    }
});


//MOSTRAR HISTORIAL 

function mostrarHistorial(historial) {
    const contenedor = document.getElementById('historial-container'); // Asegúrate de que el contenedor exista en tu HTML
    contenedor.innerHTML = ''; // Limpiar contenido previo

    if (historial.length === 0) {
        contenedor.innerHTML = '<p>No hay historial de estados disponible.</p>';
        return;
    }

    historial.forEach((estado) => {
        const elemento = document.createElement('div');
        elemento.innerHTML = `<p>Estado: ${estado.estado}, Fecha: ${new Date(estado.fecha).toLocaleDateString()}</p>`;
        contenedor.appendChild(elemento);
    });
}


async function obtenerHistorialEstados(id) {
    try {
        const response = await fetch(`/alumnoEstado/historial/${id}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const historial = await response.json();
        mostrarHistorial(historial); // Llama a otra función para mostrar el historial
    } catch (error) {
        console.error('Error al obtener el historial de estados:', error);
        // Aquí puedes manejar el error y mostrar un mensaje en la UI si lo deseas
    }
}

