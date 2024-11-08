document.addEventListener('DOMContentLoaded', function () {
    const forms = document.querySelectorAll('.inscripcion-form');

    forms.forEach(form => {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();  

            const formAction = form.getAttribute('action');

            try {
                const response = await fetch(formAction, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                }

                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();

                    console.log(data);

                    const mensajeModalText = document.getElementById('mensajeModalText');
                    mensajeModalText.innerText = data.mensaje; 

                    const modalElement = document.getElementById('mensajeModal');
                    if (modalElement) {
                        $(modalElement).modal('show'); 
                    } else {
                        console.error('No se encontró el modal en el DOM');
                    }
                } else {
                    throw new Error('La respuesta no es JSON');
                }
            } catch (error) {
                console.error('Error al enviar el formulario:', error);
            }
        });
    });
});