
// Guardar un nuevo EstadoAlumno
document.getElementById("alumnoForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const numDocAlumn = document.getElementById("docAlumno").value;
    const nombreMateria = document.getElementById("nombreMateria").value;
    const estadoActual = document.getElementById("estadoActual").value;
    const data = {
        numDocAlumn,
        nombreMateria,
        estadoActual
    };

    try {
        const response = await fetch('/alumnoEstado/agregar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (response.ok) {
          
            mostrarToast("Datos guardados correctamente", "success");
        } else {
            mostrarToast(result.message, "error");
        }
    } catch (error) {
        console.error("Error:", error);
        mostrarToast("Ocurrió un error al intentar guardar los datos", "error");
    }
});

// Modificar un EstadoAlumno
let estadoId;
function openDeleteModal(id) {
    estadoId = id;
    console.log("ID del estado a eliminar:", estadoId);
    const modal = document.getElementById('confirmDeleteModal');
    modal.style.display = 'block';
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('confirmDeleteModal');
    modal.style.display = 'none';
    modal.classList.remove('show');
}

// Dar De Baja
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

            if (response.ok) {
                const result = await response.json();
                mostrarToast(result.message, "success");
                closeModal();
            } else {
                console.error("Error en la respuesta del servidor:", response.statusText);
                mostrarToast("Hubo un error al procesar la solicitud", "error");
            }
        } catch (error) {
            console.error('Error al dar baja el estado:', error);
            mostrarToast("Error de conexión o problema en el servidor", "error");
        }
    }
});


// MOSTRAR HISTORIAL 
function abrirModal(id) {
    idHist = id
    const modal = document.getElementById('modalHistorialEstado');
    modal.style.display = 'block';
    obtenerHistorialEstados(idHist);
}

// Función para cerrar el modal
function cerrarModal() {
    const modal = document.getElementById('modalHistorialEstado');
    modal.style.display = 'none';
}

function mostrarHistorial(historial) {
    const contenedor = document.getElementById('historial-container');
    contenedor.innerHTML = '';

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
            mostrarToast("Error al obtener el historial", "error");
            throw new Error(`Error: ${response.status}`);
        }

        const historial = await response.json();
        mostrarHistorial(historial);
    } catch (error) {
        console.error('Error al obtener el historial de estados:', error);
        mostrarToast("Error al obtener el historial", "error");
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
