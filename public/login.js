document.addEventListener("DOMContentLoaded", function() {
  const mensajeError = document.querySelector(".error");

  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const user = e.target.user.value;
    const password = e.target.password.value;

    console.log(JSON.stringify(user));
    console.log(JSON.stringify(password));

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user, password })
      });

      if (!res.ok) return mensajeError.classList.remove("escondido");

      const resJson = await res.json();

      if (resJson.redirect) {
        window.location.href = resJson.redirect;
      }
    } catch (error) {
      console.error('Error:', error);
      mensajeError.textContent = error.message || 'Error al iniciar sesión';
      return mensajeError.classList.remove("escondido");
    }
  });

  document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const user = e.target.user.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    console.log(user, email, password);

    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user, email, password })
      });

      if (!res.ok) return mensajeError.classList.remove("escondido");

      const resJson = await res.json();

      if (resJson.redirect) {
        window.location.href = resJson.redirect;
      }
    } catch (error) {
      console.error('Error:', error);
      mensajeError.textContent = error.message || 'Error al registrarse';
      return mensajeError.classList.remove("escondido");
    }
  });
});
