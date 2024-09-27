  //para cerrar sesion
  document.getElementById('logout-button').addEventListener('click', function(e) {
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

    $(document).ready(function () {
        obtenerMaterias();

        function obtenerMaterias() {
            fetch('/materia/obtener')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la red');
                    }
                    return response.json(); // Convierte la respuesta en JSON
                })
                .then(data => {
                    var listaMaterias = $("#listaMaterias");
                    listaMaterias.empty();

                    var selectCorrelativas = $("#correlativas");
                    selectCorrelativas.empty();

                    if (data.length > 0) {
                        data.forEach(function (materia) {
                            var li = $("<li>");
                            li.addClass("list-group-item");
                            li.html("<strong>" + materia.nombreMateria + "</strong><span>" + (materia.correlativas.length > 0 ? materia.correlativas.map(c => "<span class='badge badge-correlativas'>" + c.nombreMateria + "</span>").join(" ") : "Ninguna") + "</span>");
                            listaMaterias.append(li);

                            // Agregar opción al select de correlativas
                            var option = $("<option>");
                            option.val(materia._id);
                            option.text(materia.nombreMateria);
                            selectCorrelativas.append(option);
                        });
                    } else {
                        listaMaterias.html("<li class='list-group-item'>No hay materias registradas.</li>");
                    }
                })
                .catch(error => {
                    console.error("Error al obtener las materias:", error);
                    var listaMaterias = $("#listaMaterias");
                    listaMaterias.html("<li class='list-group-item'>Error al cargar las materias.</li>");
                });
        }
$("#formAgregarMateria").submit(function (event) {
event.preventDefault(); // Evitar el envío tradicional del formulario

// Obtener los datos del formulario
var formData = $(this).serialize();

// Realizar la solicitud fetch para agregar la materia
fetch('/materia/agregar', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData // Enviamos los datos del formulario
})
.then(response => {
    if (!response.ok) {
        throw new Error('Error en la red: ' + response.statusText);
    }
    return response.json(); 
})
.then(response => {
    showMessage('Materia agregada correctamente', 'success'); // Mensaje de éxito
    obtenerMaterias(); // Actualizar la lista
    $("#formAgregarMateria")[0].reset(); // Limpiar el formulario
})
.catch(error => {
    console.error("Error al agregar la materia:", error);
    showMessage('Error al agregar la materia', 'danger'); // Mensaje de error
});
});

// Función para mostrar mensajes en pantalla
function showMessage(message, type) {
const messageContainer = document.createElement('div');
messageContainer.className = `alert alert-${type} position-fixed top-0 right-0 m-3`; // Cambia la posición si lo deseas
messageContainer.textContent = message;
document.body.appendChild(messageContainer);

// Eliminar el mensaje después de 3 segundos
setTimeout(() => {
    messageContainer.remove();
}, 3000);
}


    });