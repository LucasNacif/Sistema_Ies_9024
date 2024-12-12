const express = require("express");
const router = express.Router();
const controller = require("../controllers/C_alumnoEstado");

//Middlewares
const { verificarSesion, verificarRol } = require('../middlewares/autorizacion.js');

router.post("/alumnoEstado/agregar", controller.crearAlumnoEstado);

router.get("/alumnoEstado/buscar/:numDocAlumn",verificarSesion, verificarRol(['bedel', 'superAdmin']),  controller.buscarAlumnoYMaterias);

router.put(`/alumnoEstado/eliminar/:id`, controller.modificarEstadoAlumno);

router.get('/alumnoEstado/historial/:id', verificarSesion, verificarRol(['bedel', 'superAdmin']), controller.obtenerHistorialEstados);

module.exports = router;

