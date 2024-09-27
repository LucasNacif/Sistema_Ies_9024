  // Inicializa Bootstrap Material Design
  $.material.init();

  let materiasAgregadas = [];

  // Acción al agregar una materia
  $('#agregarMateria').click(function () {
      const materia = $('#materia').val();
      const correlativas = $('#correlativas').val(); // Array de IDs de correlativas

      if (materia) {
          // Agregar materia a la lista visual
          materiasAgregadas.push({ nombreMateria: materia, correlativas: correlativas });
          $('#listaMaterias').append('<li class="list-group-item">' + materia + '</li>');
          $('#materia').val(''); // Limpiar campo
      }
  });

  // Guardar plan de estudio
  $('#guardarPlan').click(function () {
      const curso = $('#curso').val();
      const planDeEstudio = {
          nombreCurso: curso,
          materias: materiasAgregadas // Lista de materias con correlativas
      };

      // Lógica para enviar el plan de estudio al backend
      $.ajax({
          url: '/plan-estudio/agregar',
          type: 'POST',
          data: JSON.stringify(planDeEstudio),
          contentType: 'application/json',
          success: function (response) {
              alert('Plan de estudio agregado exitosamente');
              window.location.reload(); // Recargar la página
          },
          error: function (error) {
              alert('Error al guardar el plan de estudio');
          }
      });
  });


// showMessage('Error al eliminar la carrera', 'danger');
// // Función para mostrar mensajes en pantalla
// function showMessage(message, type) {
//     const messageContainer = document.createElement('div');
//     messageContainer.className = `alert alert-${type}`;
//     messageContainer.textContent = message;
//     document.body.appendChild(messageContainer);

//     // Eliminar el mensaje después de 3 segundos
//     setTimeout(() => {
//         messageContainer.remove();
//     }, 3000);
// }

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