document.addEventListener("DOMContentLoaded",  function() {
  const cerrarSesionBtn = document.querySelector("button");
    
  cerrarSesionBtn.addEventListener("click", async function() {

    try {
      const res = await fetch("/logout", {
        method: "GET"
      });

      const resJson = await res.json();

      if (resJson.redirect) {
         window.location.href = resJson.redirect;
      }
    } catch (error) {
      console.log('Error al cerrar sesion',error);
    }
  });

});
