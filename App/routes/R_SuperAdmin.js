const express = require('express');
const router = express.Router();

const autenticacion = require('../controllers/autenticacion');

// Ruta para crear un bedel
router.post("/AdministracionSuperAdmin/crearBedel", (req, res) => {
    // Modificar el body para incluir el rol
    const bodyConRol = {
        ...req.body,
        rol: 'bedel'  // Forzar el rol a 'bedel'
    };
    
    // Usar la función de registro existente
    return autenticacion.registrar({ body: bodyConRol }, res);
});


module.exports = router;