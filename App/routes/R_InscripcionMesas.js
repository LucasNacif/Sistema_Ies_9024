const express = require("express");
const router = express.Router();
const controller = require("../controllers/C_inscripcionMesa");
const { verificarSesion, verificarRol } = require('../middlewares/autorizacion');

//RUTAS PARA ALUMNOS LOGUEADOS

router.get('/inscripcion/obtenerMesasActivas/', verificarSesion, verificarRol(['alumno']), controller.obtenerMesasActivas);

router.get('/inscripcion/obtenerMesasSegunAlum/', verificarSesion, verificarRol(['alumno']), controller.obtenerMesasSegunAlum);

router.post('/inscripcion/mesa/:mesaId', verificarSesion, verificarRol(['alumno']), controller.verificarPermisoParaRendir);

module.exports = router;
