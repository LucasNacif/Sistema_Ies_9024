document.addEventListener("DOMContentLoaded", () => {
    //Agregar mesa
    const formAgregarMesa = document.getElementById("formAgregarMesa");
    formAgregarMesa.addEventListener("submit", async (event) => {
        event.preventDefault();

        const horaMesa = document.getElementById("horaMesa").value;
        const materiaId = document.getElementById("Materia").value;
        const fechaMesa = document.getElementById("fechaMesa").value;
        
        const mesaData = {
            fechaMesa,
            horaMesa,
            Materia: materiaId
        };

        try {
            const response = await fetch("/mesa/crear", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(mesaData)
            });

            if (response.ok) {
                alert("Mesa creada exitosamente");
                location.reload();
            } else {
                throw new Error("Hubo un problema al crear la mesa");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al crear la mesa. Inténtalo de nuevo.");
        }
    });

    //Modificar mesa
    const formModificarMesa = document.getElementById("formModificar")
    formModificarMesa.addEventListener("submit", async (event) => {
        event.preventDefault();

        const mesaId = document.getElementById("idMesa").value;
        const fechaMesa = document.getElementById("fechaMesaMod").value;
        const horaMesa = document.getElementById("horaMesaMod").value;
        const materiaId = document.getElementById("materiaMod").value;
        const estadoMesa = document.getElementById("estadoMesaMod").value;

        const mesaData = {
            fechaMesa,
            horaMesa,
            Materia: materiaId,
            estadoActual: estadoMesa
        };

        try {
            const response = await fetch(`/mesa/modificar/${mesaId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(mesaData)
            });

            if (response.ok) {
                alert("Mesa modificada exitosamente");
                location.reload();
            } else {
                throw new Error("Hubo un problema al modificar la mesa");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al modificar la mesa. Inténtalo de nuevo.");
        }
    });

    //Para mostrar el modal de modificar
    const botonesModificar = document.querySelectorAll(".btnModificar");
    botonesModificar.forEach(button => {
        button.addEventListener("click", (e) => {

            const mesaId = e.target.getAttribute("data-id");
            const horaMesa = e.target.getAttribute("data-hora");
            const materiaId = e.target.getAttribute("data-materia");
            const estadoMesa = e.target.getAttribute("data-estado");
            const fechaMesa = e.target.getAttribute("data-fecha");

            console.log(fechaMesa)

            // Llenar los datos en el formulario del modal
            document.getElementById("idMesa").value = mesaId;
            document.getElementById("fechaMesaMod").value = fechaMesa;
            document.getElementById("horaMesaMod").value = horaMesa;
            document.getElementById("materiaMod").value = materiaId;
            document.getElementById("estadoMesaMod").value = estadoMesa;

            $('#modalModificarMesa').modal('show');
        });
    });

});