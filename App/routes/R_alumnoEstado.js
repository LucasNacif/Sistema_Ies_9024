const express = require("express");
const router = express.Router();
const controller = require("../controllers/C_alumnoEstado");

router.post("/alumnoEstado/agregar", controller.crearAlumnoEstado);

router.get("/alumnoEstado/buscar/:numDocAlumn", controller.buscarAlumnoYMaterias);

router.put(`/alumnoEstado/eliminar/:id`, controller.eliminarEstadoAlumno);

router.get('/alumnoEstado/historial/:id', controller.obtenerHistorialEstados);

module.exports = router;

