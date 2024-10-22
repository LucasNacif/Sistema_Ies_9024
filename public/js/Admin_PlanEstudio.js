document.addEventListener('DOMContentLoaded', function () {
    cargarCarreras();
    cargarMaterias();
    cargarAlumnos();

    const btnAgregar = document.getElementById('btnAgregar');
    const formContainer = document.getElementById('formContainer');
    const formMateria = document.getElementById('formMateria');

    if (btnAgregar) {
        btnAgregar.addEventListener('click', function () {
            formContainer.style.display = 'block'; 
        });
    }


    
    if (formMateria) {
        formMateria.addEventListener('submit', function (e) {
            e.preventDefault();
        
            const nombreMateria = document.getElementById('nombreMateria').value;
            const correlativas = document.getElementById('correlativas').value; 
        
            fetch('/materia/nuevaMateriaPlanDeEstudio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombreMateria,
                    correlativas: correlativas ? correlativas.split(',').map(item => item.trim()) : [] 
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    formContainer.style.display = 'none';
                    formMateria.reset();
                    cargarMaterias();
                } else if (data.error) {
                    alert(data.error);
                }
            })
            .catch(error => console.error('Error al agregar materia:', error));
        });
        
    }
});

function cargarCarreras() {
    fetch('/carrera/obtener')
        .then(response => response.json())
        .then(carreras => {
            const infoCarrera = document.getElementById('infoCarrera');
            const carrera = carreras[0]; 

            if (carrera) {
                infoCarrera.innerHTML = `
                    <tr>
                        <th>Nombre de la Carrera</th>
                        <td>${carrera.nombreCarrera}</td>
                    </tr>
                    <tr>
                        <th>Título</th>
                        <td>${carrera.titulo}</td>
                    </tr>
                    <tr>
                        <th>Carga Horaria</th>
                        <td>${carrera.cargaHoraria} horas</td>
                    </tr>
                    <tr>
                        <th>Duración</th>
                        <td>${carrera.duracion} años</td>
                    </tr>`;
            }
        })
        .catch(error => console.error('Error al cargar carreras:', error));
}

function cargarMaterias() {
    fetch('/materia/obtener')
        .then(response => response.json())
        .then(materias => {
            const listaMaterias = document.getElementById('listaMaterias');
            listaMaterias.innerHTML = '';

            materias.forEach(materia => {
                listaMaterias.innerHTML += `
                <tr>
                    <td>${materia.nombreMateria}</td>
                    <td>${materia.correlativas.length > 0 
                        ? materia.correlativas.map(correlativa => correlativa.nombreMateria).join(', ') 
                        : 'Sin correlativas'}</td>
                    <td>
                    <button class="btn btn-sm btn-edit" onclick="modificarMateria('${materia._id}')" title="Modificar">Modificar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarMateria('${materia._id}')">Dar De Baja</button>
                    </td>
                </tr>`;
            });
        })
        .catch(error => console.error('Error al cargar materias:', error));
}


function eliminarMateria(id) {
    if (confirm('¿Estás seguro de que deseas dar de baja esta materia?')) {
        fetch(`/materia/eliminar/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                cargarMaterias(); 
            })
            .catch(error => console.error('Error al eliminar materia:', error));
    }
}

function modificarMateria(id) {
    fetch(`/materia/modificar/${id}`)
        .then(response => response.json())
        .then(materia => {
            document.getElementById('nombreMateria').value = materia.nombreMateria;
            document.getElementById('correlativas').value = materia.correlativas.join(', ');

            const formMateria = document.getElementById('formMateria');
            formMateria.onsubmit = function (e) {
                e.preventDefault(); 

                fetch(`/materia/modificar/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombreMateria: document.getElementById('nombreMateria').value,
                        correlativas: document.getElementById('correlativas').value.split(',').map(item => item.trim())
                    })
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    cargarMaterias(); 
                    cancelar('formContainer');
                })
                .catch(error => console.error('Error al modificar materia:', error));
            };

            mostrarFormularioMateria(); 
        })
        .catch(error => console.error('Error al obtener la materia:', error));
}


function cargarAlumnos() {
    fetch('/alumno/obtener')
        .then(response => response.json())
        .then(alumnos => {
            const listaAlumnos = document.getElementById('listaAlumnos');
            listaAlumnos.innerHTML = ''; 

            if (alumnos.length > 0) {
                alumnos.forEach(alumno => {
                    listaAlumnos.innerHTML += `
                        <tr>
                            <td>${alumno.nombreCompleto}</td>
                            <td>${alumno.numDocAlumn}</td>
                            <td>${alumno.emailAlumn}</td>
                            <td>${alumno.curso}</td>
                            <td>${alumno.estado ? 'Legajo Completo' : 'Legajo Incompleto'}</td>
                            <td>
                                <button class="btn btn-sm btn-edit" onclick="modificarAlumno('${alumno._id}')" title="Modificar">Modificar</button>
                                <button class="btn btn-sm btn-danger" onclick="darDeBaja('${alumno.numDocAlumn}')" title="Dar de Baja">Dar De Baja</button>
                            </td>
                        </tr>`;
                });
            } else {
                listaAlumnos.innerHTML = "<tr><td colspan='6' class='text-center'>No hay alumnos registrados.</td></tr>";
            }
        })
        .catch(error => {
            console.error('Error al cargar alumnos:', error);
            const listaAlumnos = document.getElementById('listaAlumnos');
            listaAlumnos.innerHTML = "<tr><td colspan='6' class='text-center'>Error al cargar los alumnos.</td></tr>";
        });
}

function modificarAlumno(id) {
    fetch(`/alumno/modificar/${id}`)
        .then(response => response.json())
        .then(alumno => {
            // Llena el formulario con la información del alumno seleccionado
            document.getElementById('nombreAlumno').value = alumno.nombreCompleto;
            document.getElementById('emailAlumn').value = alumno.emailAlumn; // Suponiendo que tengas un campo para el email
            document.getElementById('curso').value = alumno.curso; // Suponiendo que tengas un campo para el curso
            // Agrega otros campos según lo necesites

            // Cambia el evento del formulario para que actúe como una actualización
            const formAlumno = document.getElementById('formAlumno');
            formAlumno.onsubmit = function (e) {
                e.preventDefault(); // Evita la recarga de la página

                // Realiza la petición de modificación
                fetch(`/alumno/modificar/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombreCompleto: document.getElementById('nombreAlumno').value,
                        emailAlumn: document.getElementById('emailAlumn').value, // Envía el email
                        curso: document.getElementById('curso').value, // Envía el curso
                        // Agrega otros campos según lo necesites
                    })
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    cargarAlumnos(); // Vuelve a cargar los alumnos
                    cancelar('formAgregar'); // Oculta el formulario
                })
                .catch(error => console.error('Error al modificar alumno:', error));
            };

            mostrarFormularioAlumno(); // Muestra el formulario
        })
        .catch(error => console.error('Error al obtener el alumno:', error));
}

function darDeBaja(numDocAlumn) {
    if (confirm('¿Estás seguro de que deseas dar de baja este alumno?')) {
        fetch(`/alumno/baja/${numDocAlumn}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                cargarAlumnos();
            })
            .catch(error => console.error('Error al dar de baja el alumno:', error));
    }
}


function mostrarFormularioMateria() {
    document.getElementById('formContainer').style.display = 'block';
}

function mostrarFormularioAlumno() {
    document.getElementById('formAgregar').style.display = 'block';
}

function cancelar(formId) {
    document.getElementById(formId).style.display = 'none';
    document.getElementById(formId).reset(); 
}

