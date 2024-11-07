document.addEventListener('DOMContentLoaded', () => {
   // mostrarAlumnos(true);
});

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


