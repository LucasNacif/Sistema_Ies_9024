document.addEventListener("DOMContentLoaded", function () {

  const sign_in_btn = document.querySelector("#sign-in-btn");
  const sign_up_btn = document.querySelector("#sign-up-btn");
  const container = document.querySelector(".container");
  //expresiones regulares
  const dniRegex = /^\d{7,8}$/;
  const nombreRegex = /^[a-zA-Z\s]+$/;

  sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
  });

  sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
  });

  //FORMULARIO PARA INICIAR SESION
  document.getElementById("FormLogin").addEventListener("submit", async (e) => {
    e.preventDefault();
    const dni = e.target.dni.value;
    const password = e.target.pass.value;

    if (!dniRegex.test(dni)) {
      mostrarToast("El DNI debe tener entre 7 y 8 dígitos", "error");
      return;
    }

    try {
      const res = await fetch("/index/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ dni, password })
      });

      const resJson = await res.json();

      // Manejo de mensajes de error
      if (!res.ok) {
        mostrarToast(resJson.message || 'Error al iniciar sesión', 'error');
        return;
      }

      if (resJson.redirect) {
        window.location.href = resJson.redirect;
      }
    } catch (error) {
      console.error('Error:', error);
      mostrarToast('Error al iniciar sesión', 'error');
    }
  });

  //FORMULARIO PARA REGISTRARSE
  document.getElementById("FormRegistro").addEventListener("submit", async (e) => {
    e.preventDefault();
    const dni = e.target.dni.value;
    const nombre = e.target.nombre.value;
    const email = e.target.email.value;
    const password = e.target.pass.value;

    if (!dniRegex.test(dni)) {
      mostrarToast('DNI inválido', 'error');
      return;
    }

    if (!nombre || !nombreRegex.test(nombre)) {
      mostrarToast('El nombre no puede contener símbolos especiales', 'error');
      return;
    }

    try {
      const res = await fetch("/index/registrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ dni, nombre, email, password })
      });

      const resJson = await res.json();

      // Manejo de mensajes de error
      if (!res.ok) {
        mostrarToast(resJson.message || 'Error al registrarse', 'error');
        return;
      }

      if (resJson.redirect) {
        window.location.href = resJson.redirect;
      }
    } catch (error) {
      console.error('Error:', error);
      mostrarToast('Error al registrarse', 'error');
    }
  });

});

//Para mostrar mensajes
function mostrarToast(mensaje, tipo = "info") {
  const toast = document.getElementById("mensajeToast");
  const texto = document.getElementById("mensajeTexto");

  texto.textContent = mensaje;
  toast.className = `toast-container ${tipo}`;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3500);

}