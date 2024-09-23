document.addEventListener('DOMContentLoaded', function () {
    // Asignar evento al botón "Eliminar" del modal
    document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
        eliminarCarrera(carreraIdToDelete);
        $('#confirmDeleteModal').modal('hide');
    });

    // Cargar carreras al cargar la página
    cargarCarreras();
});

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

// Cargar carreras desde la base de datos
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
                                <a href="/carrera/${carrera._id}/planEstudio" class="btn btn-info">Ver Plan de Estudios</a>
                                <button type="button" class="btn btn-danger" onclick="openDeleteModal('${carrera._id}')">Eliminar</button>
                            </div>
                        </div>
                    </div>`;
            });
        })
        .catch(error => console.error('Error al cargar carreras:', error));
}



// Abrir el modal de confirmación para eliminar carrera
let carreraIdToDelete = null;

//cuando se presiona el boton eliminar, se ejecuta este metodo para mostrar el modal
function openDeleteModal(id) {
    carreraIdToDelete = id;
    $('#confirmDeleteModal').modal('show');
}

//este metodo es para cuando presionamos el boton eliminar del modal que antes se mostró
document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
    eliminarCarrera(carreraIdToDelete);
    $('#confirmDeleteModal').modal('hide');
});

// Eliminar una carrera
function eliminarCarrera(idCarrera) {
    fetch(`/carrera/eliminar/${idCarrera}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                showMessage('Carrera eliminada correctamente', 'success');
                cargarCarreras(); // Recargar la lista de carreras
            } else {
                showMessage('Error al eliminar la carrera', 'danger');
            }
        })
        .catch(error => console.error('Error al eliminar carrera:', error));
}

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
