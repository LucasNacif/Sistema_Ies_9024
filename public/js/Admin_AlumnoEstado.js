
// Guardar un nuevo EstadoAlumno
document.getElementById("alumnoForm").addEventListener("submit", async function (event) {
    event.preventDefault(); 

    // Captura los valores de los campos
    const numDocAlumn = document.getElementById("docAlumno").value;
    const nombreMateria = document.getElementById("nombreMateria").value;
    const estadoActual = document.getElementById("estadoActual").value;

    // Define los datos a enviar
    const data = {
        numDocAlumn,
        nombreMateria,
        estadoActual
    };

    try {
        // Realiza la petición fetch
        const response = await fetch('/alumnoEstado/agregar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // Maneja la respuesta en caso de éxito
            const result = await response.json();
            mostrarToast("Datos guardados correctamente", "success"); 
        } else {
            // Maneja el error si la petición falla
            mostrarToast("Error al guardar los datos", "error"); // Muestra el mensaje de error
        }
    } catch (error) {
        console.error("Error:", error);
        mostrarToast("Ocurrió un error al intentar guardar los datos", "error"); // Muestra el mensaje de error
    }
});

// Modificar un EstadoAlumno
let estadoId;
function openDeleteModal(id) {
    estadoId = id; // Guardar el ID del estado en la variable global
    console.log("ID del estado a eliminar:", estadoId); // Verifica que el ID se establezca correctamente
    const modal = document.getElementById('confirmDeleteModal');
    modal.style.display = 'block'; // Mostrar el modal
    modal.classList.add('show'); // Agregar clase para mostrar el modal
}

function closeModal() {
    const modal = document.getElementById('confirmDeleteModal');
    modal.style.display = 'none'; // Ocultar el modal
    modal.classList.remove('show'); // Remover clase para ocultar el modal
}

// Confirmar y realizar la solicitud fetch al hacer clic en "Dar De Baja"
document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
    if (estadoId) {
        try {
            const response = await fetch(`/alumnoEstado/eliminar/${estadoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado: 'Sin estado' }),
            });

            // Verificar la respuesta
            if (response.ok) {
                const result = await response.json();
                mostrarToast(result.message, "success"); 
                closeModal(); 
            } else {
                console.error("Error en la respuesta del servidor:", response.statusText);
                mostrarToast("Hubo un error al procesar la solicitud", "error"); // Muestra el mensaje de error
            }
        } catch (error) {
            console.error('Error al dar baja el estado:', error);
            mostrarToast("Error de conexión o problema en el servidor", "error"); // Muestra el mensaje de error
        }
    }
});

// Opcional: Cerrar el modal si se hace clic fuera de él
window.onclick = function (event) {
    const modal = document.getElementById('confirmDeleteModal');
    if (event.target == modal) {
        closeModal();
    }
};

// MOSTRAR HISTORIAL 

function abrirModal(id) {
    idHist = id
    const modal = document.getElementById('modalHistorialEstado');
    modal.style.display = 'block'; // Muestra el modal
    obtenerHistorialEstados(idHist);
}

// Función para cerrar el modal
function cerrarModal() {
    const modal = document.getElementById('modalHistorialEstado');
    modal.style.display = 'none'; // Oculta el modal
}

function mostrarHistorial(historial) {
    const contenedor = document.getElementById('historial-container'); // Asegúrate de que el contenedor exista en tu HTML
    contenedor.innerHTML = ''; // Limpiar contenido previo

    if (historial.length === 0) {
        contenedor.innerHTML = '<p>No hay historial de estados disponible.</p>';
        return;
    }

    historial.forEach((estado) => {
        const elemento = document.createElement('div');
        elemento.innerHTML = `<p>Estado: ${estado.estado}, Fecha: ${new Date(estado.fecha).toLocaleDateString()}</p>`;
        contenedor.appendChild(elemento);
    });
}

async function obtenerHistorialEstados(id) {
    try {
        const response = await fetch(`/alumnoEstado/historial/${id}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const historial = await response.json();
        mostrarHistorial(historial); // Llama a otra función para mostrar el historial
    } catch (error) {
        console.error('Error al obtener el historial de estados:', error);
        mostrarToast("Error al obtener el historial", "error"); // Muestra el mensaje de error
    }
}

// Función para mostrar el toast
function mostrarToast(mensaje, tipo = "info") {
    const toast = document.getElementById("mensajeToast");
    const texto = document.getElementById("mensajeTexto");

    texto.textContent = mensaje;
    toast.className = `toast-container ${tipo}`;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
        location.reload();
    }, 1500);
}
