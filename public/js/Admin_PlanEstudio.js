document.addEventListener('DOMContentLoaded', () => {
    mostrarAlumnos(true);
});
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

//Modificar Materias
function mostrarModificarMateriaModal(button) {
    const idMateria = button.getAttribute("data-id");
    const nombreMateria = button.getAttribute("data-nombre");
    const correlativasStr = button.getAttribute("data-correlativas") || "";
    const correlativas = correlativasStr.split(",").map(c => c.trim()).filter(c => c);

    const nombreInput = document.getElementById("nombreMateria");
    const idInput = document.getElementById("idMateria");
    const listaCorrelativas = document.getElementById("listaCorrelativas");

    if (!nombreInput || !idInput || !listaCorrelativas) return;

    nombreInput.value = nombreMateria;
    idInput.value = idMateria;
    listaCorrelativas.innerHTML = '';
    correlativas.forEach(correlativa => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = correlativa;
        listaCorrelativas.appendChild(li);
    });

    $('#modificarMateriaModal').modal('show');
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
// Para guardar cambios
// function recibirDatosParaModificarAlumno() {
//     const datosAlumno = {
//         id: document.getElementById('alumnoId').value,
//         nombreCompleto: document.getElementById('nombreAlumno').value,
//         numDocAlumn: document.getElementById('numDocAlumn').value,
//         emailAlumn: document.getElementById('emailAlumn').value
//     };
//     guardarCambiosEntidad('alumno', datosAlumno);
// }
// function recibirDatosParaModificarMateria() {
//     const datosMateria = {
//         id: document.getElementById('idMateria').value,
//         nombreMateria: document.getElementById('nombreMateria').value,
//     };
//     guardarCambiosEntidad('materia', datosMateria);
// }



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


