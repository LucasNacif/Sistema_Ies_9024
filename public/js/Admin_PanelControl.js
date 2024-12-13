let carreraIdmodificar;
let carreraIDbaja;

// Mostrar el modal para agregar una nueva carrera
function agregarCarreras() {
    document.getElementById('nombreCarrera').value = '';
    document.getElementById('titulo').value = '';
    document.getElementById('cargaHoraria').value = '';
    document.getElementById('duracion').value = '';
    $('#addAlumnoModal').modal('show');
};

// Función para modificar una carrera
function modificarCarrera(idCarrera) {
    fetch(`/carrera/obtener/${idCarrera}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(carrera => {
            carreraIdmodificar = idCarrera;
            document.getElementById('modificarNombreCarrera').value = carrera.nombreCarrera || '';
            document.getElementById('modificarTitulo').value = carrera.titulo || '';
            document.getElementById('modificarCargaHoraria').value = carrera.cargaHoraria || '';
            document.getElementById('modificarDuracion').value = carrera.duracion || '';

            $('#modifyCareerModal').modal('show');
        })
        .catch(error => console.error('Error al cargar los datos de la carrera:', error));
};

// Abrir el modal de confirmación para dar de baja carrera
function openDeleteModal(idCarrera) {
    carreraIDbaja = idCarrera;
    $('#confirmDeleteModal').modal('show');
};

document.addEventListener('DOMContentLoaded', function () {
    cargarCarreras();
    $.material.init();

    async function cargarCarreras() {
        try {
          const response = await fetch('/carrera/obtener');
          const carreras = await response.json();
          
          const listaCarreras = document.getElementById('listaCarreras');
          listaCarreras.innerHTML = '';

          console.log(carreras)

          if (carreras && carreras.length > 0) {
            carreras.forEach(carrera => {
                listaCarreras.innerHTML += `
                  <div class="col-md-4">
                      <div class="custom-card" style="margin: 10px;">
                          <div class="custom-card-header text-center" title="${carrera.nombreCarrera}">
                              ${carrera.nombreCarrera}
                          </div>
                          <div class="custom-card-body">
                              <h5 class="custom-card-title" title="${carrera.titulo}">${carrera.titulo}</h5>
                              <p class="custom-card-text"><strong>Carga Horaria:</strong> ${carrera.cargaHoraria} horas</p>
                              <p class="custom-card-text"><strong>Duración:</strong> ${carrera.duracion} años</p>
                              <a href="/planEstudio/${carrera._id}" class="btn btn-info">
                                  <i class="fas fa-info-circle"></i> Información
                              </a>
                              <button type="button" class="btn btn-warning" onclick="modificarCarrera('${carrera._id}')">
                                  <i class="fas fa-edit"></i> Modificar
                              </button>
                              <button type="button" class="btn btn-danger" onclick="openDeleteModal('${carrera._id}')">
                                  <i class="fas fa-trash-alt"></i> Dar de baja
                              </button>
                          </div>
                      </div>
                  </div>`;
              });
          }else{
            listaCarreras.innerHTML += `<p>No hay carreras disponibles</p>`;
          }
          
       
        } catch (error) {
          console.error('Error al cargar carreras:', error);
        }
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

    // Evento de envío del formulario para agregar una nueva carrera
    document.getElementById('formAgregarCarrera').addEventListener('submit', function (event) {
        event.preventDefault();
        const nombreCarrera = document.getElementById('nombreCarrera').value;
        const titulo = document.getElementById('titulo').value;
        const cargaHoraria = parseInt(document.getElementById('cargaHoraria').value, 10);
        const duracion = parseInt(document.getElementById('duracion').value, 10) || 0;

        if (!nombreCarrera) {
            mostrarToast('El nombre de la carrera es obligatorio', 'danger');
            return;
        }
        fetch('/carrera/agregar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreCarrera, titulo, cargaHoraria, duracion })
        })
            .then(response => {
                if (response.ok) {
                    mostrarToast('Carrera agregada con éxito', 'success');
                    cargarCarreras();
                    document.getElementById('formAgregarCarrera').reset();
                    $('#addAlumnoModal').modal('hide');
                } else {
                    response.json().then(data => {
                        mostrarToast(data.message || 'Error al agregar la carrera', 'danger');
                    });
                }
            })
            .catch(error => console.error('Error al agregar carrera:', error));
    });

    // Enviar los datos modificados al servidor
    document.getElementById('formModificarCarrera').addEventListener('submit', function (event) {
        event.preventDefault();
        const nombreCarrera = document.getElementById('modificarNombreCarrera').value;
        const titulo = document.getElementById('modificarTitulo').value;
        const cargaHoraria = parseInt(document.getElementById('modificarCargaHoraria').value, 10);
        const duracion = parseInt(document.getElementById('modificarDuracion').value, 10);

        fetch(`/carrera/modificar/${carreraIdmodificar}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreCarrera, titulo, cargaHoraria, duracion })
        })
            .then(response => {
                if (response.ok) {
                    mostrarToast('Carrera modificada con éxito', 'success');
                    cargarCarreras();
                    $('#modifyCareerModal').modal('hide');
                } else {
                    mostrarToast('Error al modificar la carrera', 'danger');
                }
            })
            .catch(error => console.error('Error al modificar la carrera:', error));
    });

    // Dar de baja una carrera
    document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
        fetch(`/carrera/baja/${carreraIDbaja}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                if (response.ok) {
                    mostrarToast('Carrera dada de baja correctamente', 'success');
                    cargarCarreras();
                    $('#confirmDeleteModal').modal('hide');
                } else {
                    mostrarToast('Error al dar de baja la carrera', 'danger');
                }
            })
            .catch(error => console.error('Error al dar de baja carrera:', error));
    });

});

// Para mostrar mensajes
function mostrarToast(mensaje, tipo = "info") {
    const toast = document.getElementById("mensajeToast");
    const texto = document.getElementById("mensajeTexto");

    texto.textContent = mensaje;
    toast.className = `toast-container ${tipo}`;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 1500);
}
