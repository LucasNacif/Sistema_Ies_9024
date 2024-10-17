const express = require("express");
const router = express.Router();
const controller = require("../controllers/C_inscripcionMesa");

//RUTAS PARA ALUMNOS LOGUEADOS

router.get('/inscripcion/obtenerMesasActivas/', controller.obtenerMesasActivas);

router.post('/inscripcion/obtenerMesasSegunAlum/:numDoc', controller.obtenerMesasSegunAlum);

router.get('/inscripcion/alumno', controller.verificarPeermisoParaRendir);

router.post('/inscripcion/alumno/:alumnoId/mesa/:mesaId/', controller.verificarPermisoParaRendir);

module.exports = router;
