const express = require('express');
const router = express.Router();

const autenticacion = require('../controllers/autenticacion');


router.post("/AdministracionSuperAdmin/crearBedel", (req, res) => {
    // Modificar el body para incluir el rol
    const bodyConRol = {
        ...req.body,
        rol: 'bedel'  // Forzar el rol a 'bedel'
    };
    return autenticacion.registrar({ body: bodyConRol }, res);
});

router.get("/AdministracionSuperAdmin/bedeles", autenticacion.traerBedel);

router.delete("/AdministracionSuperAdmin/eliminarBedel/:id", autenticacion.delete);

module.exports = router;