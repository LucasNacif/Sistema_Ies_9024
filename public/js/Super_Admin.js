document.getElementById('formNuevoBedel').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = {
        nombre: formData.get('nombre').trim(),
        apellido: formData.get('apellido').trim(),
        email: formData.get('email').trim(),
        password: formData.get('password')
    };

    if (!data.nombre || !data.apellido || !data.email || !data.password) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Todos los campos son obligatorios'
        });
        return;
    }

    try {
        const response = await fetch('/AdministracionSuperAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const resultado = await response.json();
        console.log(resultado
            
        )
        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Bedel creado correctamente'
            });
            this.reset(); 
        } else {
            throw new Error(resultado.message || 'Error al crear bedel');
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'No se pudo crear el bedel'
        });
    }
}); 