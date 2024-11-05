//funcion para cerrar sesion
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
// Inicialización del componente de Material Design
$.material.init();

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnAgregar").addEventListener("click", mostrarFormulario);
    document.getElementById("btnModificar").addEventListener("click", modificarMesa);
    document.getElementById("btnDarDeBaja").addEventListener("click", darDeBajaMesa);
    document.getElementById("btnMostrarTodos").addEventListener("click", mostrarMesasSuspendidas);
});

function mostrarFormulario() {
    // Muestra el formulario para agregar una nueva mesa
    document.getElementById("formContainer").style.display = "block";
}

async function modificarMesa() {
    const mesaId = prompt("Ingrese el ID de la mesa a modificar:");
    // Ejemplo de datos a modificar
    const data = { fechaMesa: "2024-12-01", horaMesa: 10 };

    const response = await fetch(`/mesa/modificar/${mesaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    alert(result.message);
}

async function darDeBajaMesa() {
    const mesaId = prompt("Ingrese el ID de la mesa a dar de baja:");

    const response = await fetch(`/mesa/darDeBaja/${mesaId}`, { method: "PUT" });
    const result = await response.json();
    alert(result.message);
}

async function mostrarMesasSuspendidas() {
    const response = await fetch("/mesa/mostrarSuspendidas");
    const mesas = await response.json();
    console.log(mesas);
    alert("Consulta la consola para ver las mesas suspendidas.");
}
