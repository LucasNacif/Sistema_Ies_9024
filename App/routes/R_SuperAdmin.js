const express = require('express');
const router = express.Router();
const autentificador = require('../controllers/autenticacion');

router.post("/AdministracionSuperAdmin/añadir" , autentificador.registrar);
router.post("/AdministracionSuperAdmin/eliminar" , autentificador.delete);


module.exports = router;