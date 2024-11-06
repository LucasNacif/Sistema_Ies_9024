// Función para cerrar sesión
document.getElementById('logout-button').addEventListener('click', function(e) {
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

// Inicialización del componente de Material Design
$.material.init();

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnAgregarMesa").addEventListener("click", mostrarFormularioAgregar);
    document.getElementById("btnModificarMesa").addEventListener("click", modificarMesa);
    document.getElementById("btnDarDeBajaMesa").addEventListener("click", darDeBajaMesa);
    document.getElementById("btnMostrarSuspendidas").addEventListener("click", mostrarMesasSuspendidas);
});

// Función para mostrar el formulario de agregar una nueva mesa
function mostrarFormularioAgregar() {
    document.getElementById("formAgregarMesa").style.display = "block";
    document.getElementById("formModificarMesa").style.display = "none";
    document.getElementById("mesasSuspendidas").style.display = "none";
}

// Función para mostrar el formulario de modificar mesa
async function modificarMesa() {
    const mesaId = prompt("Ingrese el ID de la mesa a modificar:");
    if (mesaId) {
        const data = {
            fechaMesa: document.getElementById("fechaMesaMod").value,
            horaMesa: document.getElementById("horaMesaMod").value,
            Materia: document.getElementById("materiaMod").value,
            Alumno: document.getElementById("alumnoMod").value
        };

        const response = await fetch(`/mesa/modificar/${mesaId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        alert(result.message);
    }
}

// Función para dar de baja una mesa
async function darDeBajaMesa() {
    const mesaId = prompt("Ingrese el ID de la mesa a dar de baja:");
    if (mesaId) {
        const response = await fetch(`/mesa/darDeBaja/${mesaId}`, { method: "PUT" });
        const result = await response.json();
        alert(result.message);
    }
}

// Función para mostrar mesas suspendidas
async function mostrarMesasSuspendidas() {
    const response = await fetch("/mesa/mostrarSuspendidas");
    const mesas = await response.json();

    const tbody = document.getElementById("suspendidasTable");
    tbody.innerHTML = ""; // Limpiar contenido previo

    mesas.forEach(mesa => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${mesa._id}</td>
            <td>${mesa.fechaMesa}</td>
            <td>${mesa.horaMesa}</td>
            <td>${mesa.Materia}</td>
            <td>${mesa.Alumno.join(", ")}</td>
            <td>${mesa.estadoActual}</td>
        `;

        tbody.appendChild(row);
    });

    // Mostrar la tabla de mesas suspendidas y ocultar otros formularios
    document.getElementById("mesasSuspendidas").style.display = "block";
    document.getElementById("formAgregarMesa").style.display = "none";
    document.getElementById("formModificarMesa").style.display = "none";
}
