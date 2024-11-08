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
                <button class="btn btn-outline-primary btn-sm" onclick="mostrarEditarAlumnoModal(this)"
            data-id="${alumno._id}"
            data-nombre="${alumno.nombreCompleto}"
            data-numdoc="${alumno.numDocAlumn}"
            data-email="${alumno.emailAlumn}">
        <i class="zmdi zmdi-edit"></i>
    </button>
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
function mostrarEditarAlumnoModal(button) {
    const alumnoId = button.getAttribute('data-id');
    const nombreCompleto = button.getAttribute('data-nombre');
    const numDocAlumn = button.getAttribute('data-numdoc');
    const emailAlumn = button.getAttribute('data-email');

    document.getElementById('nombreAlumno').value = nombreCompleto;
    document.getElementById('numDocAlumn').value = numDocAlumn;
    document.getElementById('emailAlumn').value = emailAlumn;
    document.getElementById('alumnoId').value = alumnoId;

    $('#editarAlumnoModal').modal('show');
}
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
            location.reload();
        })
        .catch(error => console.error('Error:', error));
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
                location.reload();
                alert("Materia modificada con éxito");
            } else {
                alert("Hubo un problema al modificar la materia");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Ocurrió un error al intentar modificar la materia.");
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
function eliminarMateria() {
    const btnEliminar = document.getElementById("btnEliminarMateria")
    const idMateria = btnEliminar.getAttribute('data-id');

    fetch("/materia/eliminar", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idMateria: idMateria, idPlanEstudio: planEstudio._id })
    })
        .then(response => {
            if (!response.ok) throw new Error('Error en la petición');
            return response.json();
        })
        .then(data => {
            mostrarAlumnos(true);
            location.reload();
        })
        .catch(error => console.error('Error:', error));
}


