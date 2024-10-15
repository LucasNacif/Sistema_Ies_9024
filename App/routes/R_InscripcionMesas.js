const express = require("express");
const router = express.Router();
const controller = require("../controllers/C_inscripcionMesa");

//RUTAS PARA ALUMNOS LOGUEADOS
router.get('/inscripcion/obtenerMesasActivas/', controller.obtenerMesasActivas);
router.get('/inscripcion/alumno/:alumnoId/mesa/:mesaId/', controller.verificarPermisoParaRendir);

module.exports = router;
