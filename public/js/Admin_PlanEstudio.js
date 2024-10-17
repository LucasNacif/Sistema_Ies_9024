document.addEventListener('DOMContentLoaded', function () {
    cargarCarreras();
    cargarMaterias();
    cargarAlumnos();
});

// Agregar Materia
function abrirModalAgregarMateria() {
    $('#modalAgregarMateriaLabel').text('Agregar Materia');
    $('#formAgregarMateria')[0].reset();  // Resetear el formulario
    $('#modalAgregarMateria').modal('show');
}

// Modificar Materia
function abrirModalModificarMateria(idMateria) {
    $('#modalAgregarMateriaLabel').text('Modificar Materia');
    cargarDatosMateria(idMateria);  // Cargar los datos de la materia
    $('#modalAgregarMateria').modal('show');
}

function cargarDatosMateria(idMateria) {
    fetch(`/materia/${idMateria}`)
        .then(response => response.json())
        .then(materia => {
            $('#materiaId').val(materia._id);
            $('#nombreMateria').val(materia.nombreMateria);
            // Aquí puedes cargar correlativas si es necesario
        })
        .catch(error => console.error('Error al cargar los datos de la materia:', error));
}

// Eliminar Materia
function eliminarMateria(idMateria) {
    if (confirm('¿Está seguro de eliminar esta materia?')) {
        fetch(`/materia/eliminar/${idMateria}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    alert('Materia eliminada correctamente');
                    cargarMaterias();
                } else {
                    alert('Error al eliminar la materia');
                }
            })
            .catch(error => console.error('Error al eliminar la materia:', error));
    }
}

// Agregar Alumno
function abrirModalAgregarAlumno() {
    $('#modalAgregarAlumnoLabel').text('Agregar Alumno');
    $('#formAgregarAlumno')[0].reset();  // Resetear el formulario
    $('#modalAgregarAlumno').modal('show');
}

// Modificar Alumno
function abrirModalModificarAlumno(idAlumno) {
    $('#modalAgregarAlumnoLabel').text('Modificar Alumno');
    cargarDatosAlumno(idAlumno);  // Cargar los datos del alumno
    $('#modalAgregarAlumno').modal('show');
}

function cargarDatosAlumno(idAlumno) {
    fetch(`/alumno/${idAlumno}`)
        .then(response => response.json())
        .then(alumno => {
            $('#alumnoId').val(alumno._id);
            $('#nombreCompleto').val(alumno.nombreCompleto);
            $('#numDocAlumn').val(alumno.numDocAlumn);
            $('#emailAlumn').val(alumno.emailAlumn);
            $('#curso').val(alumno.curso);
            // Aquí van los demás campos
        })
        .catch(error => console.error('Error al cargar los datos del alumno:', error));
}

// Dar de Baja Alumno
function darDeBajaAlumno(idAlumno) {
    if (confirm('¿Está seguro de dar de baja este alumno?')) {
        fetch(`/alumno/darDeBaja/${idAlumno}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    alert('Alumno dado de baja correctamente');
                    cargarAlumnos();
                } else {
                    alert('Error al dar de baja el alumno');
                }
            })
            .catch(error => console.error('Error al dar de baja el alumno:', error));
    }
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
