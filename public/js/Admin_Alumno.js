// Alumno_Admin.js
document.addEventListener("DOMContentLoaded", function () {
    const alumnosTableBody = document.querySelector('#alumnosTable tbody');
    const alumnosTable = document.getElementById('alumnosTable');
    const btnAgregar = document.getElementById("btnAgregar");
    const formAgregar = document.getElementById("formAgregar");
    const btnModificar = document.getElementById("btnModificar")
    const formModificar = document.getElementById("formModificar");
    const btnDarDeBaja = document.getElementById("btnDarDeBaja")
    const btnMostrarTodos = document.getElementById("btnMostrarTodos");
    const btnVolver = document.getElementById("btnVolver");
    const searchBox = document.getElementById("searchBox");
    const errorTableAlumnos = document.getElementById('errorTableAlumnos');

    //Manejo de errores
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    const error = urlParams.get('error');
    const mensajeOK = document.getElementById('mensajeOK');
    const mensajeERROR = document.getElementById('mensajeERROR');

    // Inicializar tabla con alumnos activos
    cargarAlumnos(true);

    // Función para CARGAR alumnos activos o inactivos
    async function cargarAlumnos(activo) {
        try {
            const response = await fetch(`/alumno/obtenerAlumnos?activos=${activo}`);

            if (!response.ok) {
                throw new Error('No se pudo obtener los alumnos.');
            }

            const data = await response.json();

            if (data.mensaje) { // Si hay un mensaje, no hay alumnos disponibles
                alumnosTableBody.innerHTML = '';
                errorTableAlumnos.textContent = data.mensaje;
                errorTableAlumnos.style.display = "block";
                alumnosTable.style.display = "none";
                return;
            }

            // Si hay alumnos, cargar los datos en la tabla
            alumnosTableBody.innerHTML = '';
            data.forEach(alumno => {
                const row = document.createElement('tr');
                row.className = alumno.banderaBooleana ? 'alumno-activo' : 'alumno-dado-de-baja';
                row.innerHTML = `
                    <td>${alumno.nombreCompleto}</td>
                    <td>${alumno.numDocAlumn}</td>
                    <td>${alumno.nombre}</td>
                    <td>${alumno.corte}</td>
                    <td>${alumno.emailAlumn}</td>
                    <td>${alumno.tituloSecundario ? 'Sí' : 'No'}</td>
                    <td>${alumno.psicofisico ? 'Sí' : 'No'}</td>
                    <td>${alumno.partidaNacim ? 'Sí' : 'No'}</td>
                    <td>${alumno.dniActualizado ? 'Sí' : 'No'}</td>
                    <td>${alumno.analiticoFiel ? 'Sí' : 'No'}</td>
                    <td>${alumno.antecedenPen ? 'Sí' : 'No'}</td>
                `;
                alumnosTableBody.appendChild(row);
            });

            errorTableAlumnos.textContent = '';
            errorTableAlumnos.style.display = "none";
            alumnosTable.style.display = "block";
        } catch (error) {
            console.error('Error al cargar alumnos:', error);
            alumnosTableBody.innerHTML = '';
            errorTableAlumnos.textContent = 'Ocurrió un error al cargar los alumnos.';
            alumnosTable.style.display = "block";
        }
    }

    // MOSTRAR/OCULTAR formulario de agregar alumno
    btnAgregar.addEventListener("click", function () {
        if (formAgregar.style.display === "none" || formAgregar.style.display === "") {
            formModificar.style.display = "none";
            formAgregar.style.display = "block";
            btnAgregar.textContent = "Ocultar formAgregarulario";
        } else {
            formAgregar.style.display = "none";
            btnAgregar.textContent = "Agregar Nuevo Alumno";
        }
    });

    // Evento para el botón MODIFICAR
    btnModificar.addEventListener("click", async function () {
        formAgregar.style.display = "none";
        btnAgregar.textContent = "Agregar Nuevo Alumno";
        //Esto habria que meterlo en otra funcion
        const numDocAlumn = prompt("Ingrese el número de documento del alumno que desea modificar:");

        if (numDocAlumn == null || numDocAlumn.trim() === "") {
            mensajeERROR.textContent = "Ingrese el número de documento del alumno que desea modificar.";
            mensajeERROR.style.display = "block";
            return;
        }

        if (numDocAlumn) {
            try {
                const response = await fetch(`/alumno/traerPorDoc/${numDocAlumn}`, {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    mensajeERROR.textContent = data.error;
                    mensajeERROR.style.display = "block";
                    return;
                }

                const alumno = await response.json();
                formModificar.style.display = "block";
                document.getElementById("modNombreCompleto").value = alumno.nombreCompleto;
                document.getElementById("modNumDocAlumn").value = alumno.numDocAlumn;
                document.getElementById("modNombre").value = alumno.nombre;
                document.getElementById("modCorte").value = alumno.corte;
                document.getElementById("modEmailAlumn").value = alumno.emailAlumn;
                document.getElementById("modTituloSecundario").checked = alumno.tituloSecundario;
                document.getElementById("modPsicofisico").checked = alumno.psicofisico;
                document.getElementById("modPartidaNacim").checked = alumno.partidaNacim;
                document.getElementById("modDniActualizado").checked = alumno.dniActualizado;
                document.getElementById("modAnaliticoFiel").checked = alumno.analiticoFiel;
                document.getElementById("modAntecedenPen").checked = alumno.antecedenPen;
            } catch (error) {
                console.error("Error al obtener los datos del alumno:", error.message);
                mensajeERROR.textContent = "Hubo un error al obtener los datos del alumno";
                mensajeERROR.style.display = "block";
            }
        } else {
            mensajeERROR.textContent = "Ingrese el número de documento del alumno que desea modificar";
            mensajeERROR.style.display = "block";
        }
    });

    // Evento para el botón BAJA
    btnDarDeBaja.addEventListener("click", async function () {
        //Esto habria que meterlo en otra funcion
        const numDocAlumn = prompt("Ingrese el número de documento del alumno que desea dar de baja:");

        if (numDocAlumn == null || numDocAlumn.trim() === "") {
            mensajeERROR.textContent = "Ingrese el número de documento del alumno que desea dar de baja.";
            mensajeERROR.style.display = "block";
            return;
        }
        try {
            const response = await fetch(`/alumno/baja/${numDocAlumn}`, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (!response.ok) {
                mensajeERROR.textContent = data.error;
                mensajeERROR.style.display = "block";
                return;
            }
            cargarAlumnos(true);
            mensajeOK.textContent = data.message;
            mensajeOK.style.display = "block";
        } catch (error) {
            console.error("Error al dar de baja el alumno:", error.message);
            mensajeERROR.textContent = "Hubo un error al dar de baja el alumno";
            mensajeERROR.style.display = "block";
        }
    });

    // Evento para el botón MOSTRAR TODOS LOS ALUMNOS
    btnMostrarTodos.addEventListener("click", function () {
        if (btnMostrarTodos.textContent.includes("Mostrar Alumnos de baja")) {
            cargarAlumnos(false);
            btnMostrarTodos.textContent = "Ocultar Alumnos de baja";
        } else {
            cargarAlumnos(true);
            btnMostrarTodos.textContent = "Mostrar Alumnos de baja";
        }
    });

    // Evento para el botón VOLVER
    btnVolver.addEventListener("click", function () {
        window.location.href = "/";
    });

    //BUSCARDOR
    searchBox.addEventListener("keyup", function () {
        const searchTerm
            = this.value.toLowerCase(); const rows =
                alumnosTable.getElementsByTagName("tr");
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i]; const cells = row.getElementsByTagName("td");
            let found = false; for (let j = 0; j < cells.length; j++) {
                if
                    (cells[j].textContent.toLowerCase().includes(searchTerm)) {
                    found = true;
                    break;
                }
            } row.style.display = found ? "" : "none";
        }
    });

    //MANEJO DE ERRORES
    if (message) {
        mensajeOK.textContent = message;
        mensajeOK.style.display = "block";
        urlParams.delete('message');

    } else {
        mensajeOK.style.display = "none";
    }
    if (error) {
        mensajeERROR.textContent = error;
        mensajeERROR.style.display = "block";
        urlParams.delete('error');
    } else {
        mensajeERROR.style.display = "none";
    }

    // Actualizar la URL sin los parámetros
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, '', newUrl);

    //para cerrar sesion
    document.getElementById('logout-button').addEventListener('click', function (e) {
        e.preventDefault(); // Evitar que se recargue la página
        fetch('/index/logout', { method: 'POST', credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'ok') {
                    // Redirigir o realizar alguna acción
                    window.location.href = data.redirect;
                }
            })
            .catch(error => console.error('Error:', error));
    });
});