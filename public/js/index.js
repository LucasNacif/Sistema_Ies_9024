document.addEventListener("DOMContentLoaded", function () {

  const sign_in_btn = document.querySelector("#sign-in-btn");
  const sign_up_btn = document.querySelector("#sign-up-btn");
  const container = document.querySelector(".container");

  sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
  });

  sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
  });

  // Función para mostrar el mensaje de error
  const mensajeError = document.getElementById("mensajeError");
  function mostrarError(mensaje) {
    mensajeError.textContent = mensaje;
    mensajeError.classList.add("show");
  }

  //FORMULARIO PARA INICIAR SESION
  document.getElementById("FormLogin").addEventListener("submit", async (e) => {
    e.preventDefault();
    const dni = e.target.dni.value;
    const password = e.target.pass.value;

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
        mostrarError(resJson.message || 'Error al iniciar sesión');
        return;
      }

      if (resJson.redirect) {
        window.location.href = resJson.redirect;
      }
    } catch (error) {
      console.error('Error:', error);
      mostrarError('Error al iniciar sesión');
    }
  });

  //FORMULARIO PARA REGISTRARSE
  document.getElementById("FormRegistro").addEventListener("submit", async (e) => {
    e.preventDefault();
    const dni = e.target.dni.value;
    const nombre = e.target.nombre.value;
    const email = e.target.email.value;
    const password = e.target.pass.value;

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
    mostrarError(resJson.message || 'Error al iniciar sesión');
    return;
  }

  if (resJson.redirect) {
    window.location.href = resJson.redirect;
  }
} catch (error) {
  console.error('Error:', error);
  mostrarError('Error al iniciar sesión');
}
  });

});  