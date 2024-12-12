
document.addEventListener('DOMContentLoaded', function () {
    cargarBedeles();

    async function cargarBedeles() {
        try {
            const response = await fetch('/AdministracionSuperAdmin/bedeles');
            const resultado = await response.json();

            if (response.ok && Array.isArray(resultado)) {
                llenarTablaBedeles(resultado);
            } else {
                mostrarToast("No se pudieron cargar los bedeles", "error");
            }
        } catch (error) {
            console.error("Error al cargar los bedeles:", error);
            mostrarToast("No se pudieron cargar los bedeles", "error");
        }
    }

    // Función para llenar la tabla con los datos de los bedeles
    function llenarTablaBedeles(bedeles) {
        const tabla = document.getElementById("tablaBedeles");
        tabla.innerHTML = "";

        bedeles.forEach(bedel => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${bedel.dni}</td>
                <td>${bedel.nombre}</td>
                <td>${bedel.email}</td>
                <td>
                   <button class="btn btn-danger" onclick="eliminarBedel('${bedel._id}')">Eliminar</button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    }

    document.getElementById('formNuevoBedel').addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = {
            nombre: formData.get('nombre').trim(),
            dni: formData.get('dni').trim(),
            email: formData.get('email').trim(),
            password: formData.get('password')
        };

        // Validación de campos vacíos
        if (!data.nombre || !data.dni || !data.email || !data.password) {
            mostrarToast("Todos los campos son obligatorios", "error");
            return;
        }

        // Validación del nombre (solo letras y espacios)
        const nombreRegex = /^[a-zA-Z\s]+$/;
        if (!nombreRegex.test(data.nombre)) {
            mostrarToast("El nombre solo puede contener letras y espacios", "error");
            return;
        }

        // Validación del DNI (debe ser un número de 7 u 8 dígitos)
        const dniRegex = /^\d{7,8}$/;
        if (!dniRegex.test(data.dni)) {
            mostrarToast("El DNI debe tener entre 7 y 8 dígitos", "error");
            return;
        }

        try {
            const response = await fetch('/AdministracionSuperAdmin/crearBedel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const resultado = await response.json();

            // Mostrar mensajes según el resultado
            if (response.ok) {
                mostrarToast("Bedel creado correctamente", "success");
            } else {
                throw new Error(resultado.message || "Error al crear bedel");
            }
        } catch (error) {
            mostrarToast(error.message || "No se pudo crear el bedel", "error");
        }
    });

});
// Función para eliminar un bedel
async function eliminarBedel(bedelId) {
    try {
        const response = await fetch(`/AdministracionSuperAdmin/eliminarBedel/${bedelId}`, {
            method: 'DELETE',
        });
        const resultado = await response.json();
        if (response.ok) {
            mostrarToast("Bedel eliminado correctamente", "success");
        } else {
            throw new Error(resultado.message || "Error al eliminar al bedel");
        }
    } catch (error) {
        console.error("Error al eliminar el bedel:", error);
        mostrarToast("No se pudo eliminar el bedel", "error");
    }
}
//Para mostrar mensajes
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