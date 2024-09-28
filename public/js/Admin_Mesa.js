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