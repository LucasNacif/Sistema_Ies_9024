document.addEventListener('DOMContentLoaded', () => {
    mostrarAlumnos(true);
});

//_____ALUMNOS_______

//Cargar Alumnos
function mostrarAlumnos(esBaja) {
    const alumnos = planEstudio && planEstudio.alumnos ? planEstudio.alumnos : [];
    const alumnosFiltrados = alumnos.filter(alumno => alumno.banderaBooleana === esBaja);
    const tbody = document.getElementById('alumnosFiltrados');
    tbody.innerHTML = '';
    alumnosFiltrados.forEach(alumno => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${alumno.nombreCompleto}</td>
            <td>${alumno.numDocAlumn}</td>
            <td>${alumno.emailAlumn}</td>
            <td>${alumno.corte}</td>
            <td>${alumno.tituloSecundario ? '<i class="zmdi zmdi-check-circle text-success"></i>' : '<i class="zmdi zmdi-close-circle text-danger"></i>'}</td>
            <td>${alumno.psicofisico ? '<i class="zmdi zmdi-check-circle text-success"></i>' : '<i class="zmdi zmdi-close-circle text-danger"></i>'}</td>
            <td>${alumno.partidaNacim ? '<i class="zmdi zmdi-check-circle text-success"></i>' : '<i class="zmdi zmdi-close-circle text-danger"></i>'}</td>
            <td>${alumno.dniActualizado ? '<i class="zmdi zmdi-check-circle text-success"></i>' : '<i class="zmdi zmdi-close-circle text-danger"></i>'}</td>
            <td>${alumno.analiticoFiel ? '<i class="zmdi zmdi-check-circle text-success"></i>' : '<i class="zmdi zmdi-close-circle text-danger"></i>'}</td>
            <td>${alumno.antecedenPen ? '<i class="zmdi zmdi-check-circle text-success"></i>' : '<i class="zmdi zmdi-close-circle text-danger"></i>'}</td>
            <td>
                <button class="btn btn-outline-primary btn-sm editar-btn"
                onclick="mostrarModificarAlumnoModal(this)"
                data-id="${alumno._id}"
                data-nombre="${alumno.nombreCompleto}"
                data-numdoc="${alumno.numDocAlumn}"
                data-email="${alumno.emailAlumn}"
                data-corte="${alumno.corte}"
                data-tituloSecundario="${alumno.tituloSecundario}"
                data-psicofisico="${alumno.psicofisico}"
                data-partidaNacim="${alumno.partidaNacim}"
                data-dniActualizado="${alumno.dniActualizado}"
                data-analiticoFiel="${alumno.analiticoFiel}"
                data-antecedenPen="${alumno.antecedenPen}">
                  <i class="zmdi zmdi-edit"></i>
                </button>

            <!-- dependiendo de la bandera booleana te muestra un boton o el otro -->
            
            ${alumno.banderaBooleana
                ? `<button class="btn btn-outline-warning btn-sm" data-id="${alumno._id}" onclick="AltayBajaAlumno(false, this)">
                    <i class="zmdi zmdi-eye-off"></i>
                 </button>`
                : `<button class="btn btn-outline-success btn-sm" data-id="${alumno._id}" onclick="AltayBajaAlumno(true, this)">
                    <i class="zmdi zmdi-check"></i>
                 </button>`
            }
            </td>
        `;
        tbody.appendChild(row);
    });
    document.getElementById('tablaAlumnos').style.display = 'table';
}
//Modificar Alumnos
function mostrarModificarAlumnoModal(button) {
    const alumnoId = button.getAttribute('data-id');
    const nombre = button.getAttribute('data-nombre');
    const numDoc = button.getAttribute('data-numdoc');
    const email = button.getAttribute('data-email');
    const corte = button.getAttribute('data-corte');

    const tituloSecundario = button.getAttribute('data-tituloSecundario') === "true";
    const psicofisico = button.getAttribute('data-psicofisico') === "true";
    const partidaNacim = button.getAttribute('data-partidaNacim') === "true";
    const dniActualizado  = button.getAttribute('data-dniActualizado') === "true";
    const analiticoFiel = button.getAttribute('data-analiticoFiel') === "true";
    const antecedentesPenales = button.getAttribute('data-antecedenPen') === "true";

    // Rellenar los campos del formulario del modal
    $('#nombreCompletoModificar').val(nombre);
    $('#numDocAlumnModificar').val(numDoc);
    $('#emailAlumnModificar').val(email);
    $('#corteModificar').val(corte);
    $('#tituloSecundarioModificar').prop('checked', tituloSecundario);
    $('#psicofisicoModificar').prop('checked', psicofisico);
    $('#partidaNacimModificar').prop('checked', partidaNacim);
    $('#dniActualizadoModificar').prop('checked', dniActualizado);
    $('#analiticoFielModificar').prop('checked', analiticoFiel);
    $('#antecedenPenModificar').prop('checked', antecedentesPenales);
    $('#idAlumnoModificar').val(alumnoId);

    // Mostrar el modal
    $('#modificarAlumnoModal').modal('show');
}

document.getElementById("formModificarAlumno").addEventListener("submit", async function (e) {
    e.preventDefault(); 
  
    const data = {
        nombreCompleto: document.getElementById("nombreCompletoModificar").value,
        numDocAlumn: document.getElementById("numDocAlumnModificar").value,
        corte: document.getElementById("corteModificar").value,
        emailAlumn: document.getElementById("emailAlumnModificar").value,
        tituloSecundario: document.getElementById("tituloSecundarioModificar").checked, 
        psicofisico: document.getElementById("psicofisicoModificar").checked, 
        partidaNacim: document.getElementById("partidaNacimModificar").checked, 
        dniActualizado: document.getElementById("dniActualizadoModificar").checked, 
        analiticoFiel: document.getElementById("analiticoFielModificar").checked, 
        antecedenPen: document.getElementById("antecedenPenModificar").checked, 
    };
    try {
      const response = await fetch("/alumno/modificar", {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(data), 
      });
  
      const result = await response.json();
      if (response.ok) {
          $('#modificarAlumnoModal').modal('hide');
          mostrarToast(result.message, "success"); 
      } else {
        mostrarToast(result.error || "Hubo un error al modificar el alumno.", "error"); 
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      mostrarToast(result.error || "Error al enviar la solicitud.", "error");
    }
  });
  

//Baja y alta de alumnos
function AltayBajaAlumno(tipo, button) {
    const idAlumno = button.getAttribute('data-id');
    const body = tipo === true
        ? { estado: true, idAlumno: idAlumno }
        : { estado: false, idAlumno: idAlumno }

    fetch("/alumno/estado", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(response => {
            if (!response.ok) throw new Error('Error en la petición');
            return response.json();
        })
        .then(data => {
            mostrarToast(data.message || "Estado del alumno actualizado correctamente.", "success");
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarToast("Error al actualizar el estado del alumno.", "error");
        });
}

//_____MATERIAS_______

//Formulario para modificar materia
document.getElementById('formModificarMateria').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombreMateria = document.getElementById('nombreMateria').value;
    const idMateria = document.getElementById('idMateria').value;
    const nuevaCorrelativa = document.getElementById('nuevaCorrelativa').value;

    const data = {
        nombreMateria: nombreMateria,
        idMateria: idMateria,
        nuevaCorrelativa: nuevaCorrelativa
    };

    fetch(`/materia/modificar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarToast("Materia modificada con éxito.", "success");
            } else {
                mostrarToast("Hubo un problema al modificar la materia.", "error");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            mostrarToast("Ocurrió un error al intentar modificar la materia.", "error");
        });
});
//funcion para mostrar el modal de materias
function mostrarModificarMateriaModal(element) {
    const materiaId = element.getAttribute('data-id');
    const nombreMateria = element.getAttribute('data-nombre');
    const correlativasString = element.getAttribute('data-correlativas');

    document.getElementById('idMateria').value = materiaId;
    document.getElementById('nombreMateria').value = nombreMateria;
    const listaCorrelativas = document.getElementById('listaCorrelativas');
    listaCorrelativas.innerHTML = '';

    // Convertir la cadena de correlativas en un array y añadir cada correlativa a la lista
    const correlativasArray = correlativasString.split(',').filter(correlativa => correlativa.trim() !== '');
    correlativasArray.forEach(correlativa => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = correlativa;
        listaCorrelativas.appendChild(listItem);
    });
    $('#modificarMateriaModal').modal('show');
}
//Eliminar Materia
function eliminarMateria(button) {
    const idMateria = button.getAttribute('data-id'); 
    fetch("/materia/eliminar", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({idMateria: idMateria, idPlanEstudio: planEstudio._id })
    })
    .then(response => {
        if (!response.ok) throw new Error('Error en la petición');
        return response.json();
    })
    .then(data => {
        mostrarToast(data.message || "Materia eliminada con éxito.", "success");
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarToast("Error al eliminar la materia.", "error");
    });
}

//Para mostrar mensajes
function mostrarToast(mensaje, tipo = "info") {
    const toast = document.getElementById("mensajeToast");
    const texto = document.getElementById("mensajeTexto");
  
    texto.textContent = mensaje;
    toast.className = `toast-container ${tipo}`; 
    toast.style.display = "block";
  
    // Ocultar automáticamente después de 3 segundos
    setTimeout(() => {
      toast.style.display = "none";
      mostrarAlumnos(true);
      location.reload();
    }, 1500);
    
  }
  