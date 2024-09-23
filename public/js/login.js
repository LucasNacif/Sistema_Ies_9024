

document.addEventListener("DOMContentLoaded", function() {

  const sign_in_btn = document.querySelector("#sign-in-btn");
  const sign_up_btn = document.querySelector("#sign-up-btn");
  const container = document.querySelector(".container");
  
  sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
  });
  
  sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
  });


  document.getElementById("sign-in-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const user = e.target.user.value;
    const password = e.target.pass.value;

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

  document.getElementById("sign-up-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const user = e.target.user.value;
    const email = e.target.email.value;
    const password = e.target.pass.value;

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
